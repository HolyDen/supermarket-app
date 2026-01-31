import { useState, useRef, useCallback } from 'react';

interface DebouncedUpdateOptions {
    delay?: number;
    onError?: (error: any) => void;
}

/**
 * Custom hook for optimistic UI updates with debounced API calls
 * 
 * How it works:
 * 1. Update UI immediately (optimistic)
 * 2. Debounce the API call (wait for user to stop making changes)
 * 3. Sync with server after delay
 * 4. Handle errors by rolling back optimistic changes
 * 
 * @param delay - Milliseconds to wait before syncing (default: 1000ms)
 */
export function useDebouncedCartUpdate(options: DebouncedUpdateOptions = {}) {
    const { delay = 1000, onError } = options;

    // Local optimistic state - overrides server data temporarily
    const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({});

    // Track pending updates (for showing "syncing..." indicator)
    const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

    // Store debounce timers for each product
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    /**
     * Update quantity with optimistic UI and debounced API call
     */
    const updateQuantity = useCallback(
        (productId: string, newQuantity: number, apiCallback: () => Promise<void>) => {
            // 1. Update UI immediately (optimistic update)
            setOptimisticQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));

            // 2. Clear existing timer for this product
            if (timers.current[productId]) {
                clearTimeout(timers.current[productId]);
            }

            // 3. Mark as pending
            setPendingUpdates(prev => new Set(prev).add(productId));

            // 4. Set new debounce timer
            timers.current[productId] = setTimeout(async () => {
                try {
                    // 5. Call API after user stops making changes
                    await apiCallback();

                    // 6. Success - remove optimistic override (use server data)
                    setOptimisticQuantities(prev => {
                        const updated = { ...prev };
                        delete updated[productId];
                        return updated;
                    });
                } catch (error) {
                    // 7. Error - rollback optimistic update
                    setOptimisticQuantities(prev => {
                        const updated = { ...prev };
                        delete updated[productId];
                        return updated;
                    });

                    if (onError) {
                        onError(error);
                    }
                } finally {
                    // 8. Remove from pending
                    setPendingUpdates(prev => {
                        const updated = new Set(prev);
                        updated.delete(productId);
                        return updated;
                    });

                    // Clean up timer reference
                    delete timers.current[productId];
                }
            }, delay);
        },
        [delay, onError]
    );

    /**
     * Get display quantity - uses optimistic value if available, otherwise server value
     */
    const getDisplayQuantity = useCallback(
        (productId: string, serverQuantity: number): number => {
            return optimisticQuantities[productId] ?? serverQuantity;
        },
        [optimisticQuantities]
    );

    /**
     * Check if a product has pending update
     */
    const isPending = useCallback(
        (productId: string): boolean => {
            return pendingUpdates.has(productId);
        },
        [pendingUpdates]
    );

    /**
     * Cancel pending update for a product (useful for cleanup)
     */
    const cancelUpdate = useCallback((productId: string) => {
        if (timers.current[productId]) {
            clearTimeout(timers.current[productId]);
            delete timers.current[productId];
        }

        setOptimisticQuantities(prev => {
            const updated = { ...prev };
            delete updated[productId];
            return updated;
        });

        setPendingUpdates(prev => {
            const updated = new Set(prev);
            updated.delete(productId);
            return updated;
        });
    }, []);

    /**
     * Flush all pending updates immediately (useful on unmount or navigation)
     */
    const flushAll = useCallback(() => {
        // Clear all timers without triggering API calls
        Object.keys(timers.current).forEach(productId => {
            if (timers.current[productId]) {
                clearTimeout(timers.current[productId]);
            }
        });

        timers.current = {};
        setOptimisticQuantities({});
        setPendingUpdates(new Set());
    }, []);

    return {
        updateQuantity,
        getDisplayQuantity,
        isPending,
        cancelUpdate,
        flushAll,
        hasPendingUpdates: pendingUpdates.size > 0,
    };
}