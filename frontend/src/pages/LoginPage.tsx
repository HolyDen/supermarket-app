import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className='max-w-md mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Welcome Back
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Login to your account to continue shopping
        </p>
      </div>

      <div className='card'>
        <LoginForm />
        
        <div className='mt-6 text-center'>
          <p className='text-gray-600 dark:text-gray-400'>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary-600 dark:text-primary-400 hover:underline'>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
