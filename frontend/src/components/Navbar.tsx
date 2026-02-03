import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import { resetCart } from '../redux/cartSlice';
import ThemeToggle from './ThemeToggle';
import { showToast } from './Toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const cartItemsCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Truncate username if longer than 10 characters
  const displayName = user?.username
    ? (user.username.length > 10 ? user.username.substring(0, 10) + '...' : user.username)
    : '';

  const handleLogout = async () => {
    // Call backend logout (ignore errors)
    try {
      if (token) {
        await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000
          }
        );
      }
    } catch (error) {
      // Silently ignore - logout anyway
      console.log('Logout API call failed, but logging out locally');
    }

    // Always logout on frontend
    dispatch(logout());
    dispatch(resetCart());
    showToast('Logged out successfully', 'success');
    navigate('/');
    setIsMenuOpen(false); // Close menu on logout
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-3xl">🛒</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Supermarket
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile (md:flex = 768px+) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Products
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Orders
                  </Link>

                  {user?.is_admin && (
                    <Link
                      to="/admin"
                      className="relative group text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
                      title="Admin"
                    >
                      {/* Gear Icon - Always visible */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>

                      {/* Text - Hidden on md (768-1023px), shown on lg (1024px+) */}
                      <span className="hidden lg:inline ml-1">Admin</span>

                      {/* Tooltip - Only visible on md (768-1023px) with hover, hidden on lg */}
                      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 
                                     px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs 
                                     rounded whitespace-nowrap pointer-events-none
                                     opacity-0 group-hover:opacity-100 group-focus:opacity-100
                                     transition-opacity duration-150
                                     hidden md:block lg:hidden">
                        Admin
                      </span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

            {/* Icons Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}

              <ThemeToggle />
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <>
                {/* Separator */}
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

                <div className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {displayName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Icons - Visible only on mobile (md:hidden = <768px) */}
          <div className="flex md:hidden items-center space-x-3">
            {isAuthenticated && (
              <Link
                to="/cart"
                className="relative text-gray-700 dark:text-gray-300"
                onClick={closeMenu}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            <ThemeToggle />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                // X icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slides down when open (md:hidden = <768px) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
            {/* Navigation Links */}
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={closeMenu}
            >
              Products
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  onClick={closeMenu}
                >
                  Orders
                </Link>

                {user?.is_admin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin
                    </div>
                  </Link>
                )}

                {/* User Section Separator */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                {/* User Info */}
                <div className="px-4 py-2">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="px-4 pt-2">
                <Link
                  to="/login"
                  className="block w-full btn-primary text-center"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}