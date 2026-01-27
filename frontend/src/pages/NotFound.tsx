import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
      <div className='text-9xl mb-4'>🛒</div>
      <h1 className='text-6xl font-bold text-gray-900 dark:text-white mb-4'>
        404
      </h1>
      <h2 className='text-2xl text-gray-600 dark:text-gray-400 mb-8'>
        Oops! Page not found
      </h2>
      <p className='text-gray-500 dark:text-gray-500 mb-8 max-w-md'>
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link to='/' className='btn-primary text-lg'>
        Back to Home
      </Link>
    </div>
  );
}
