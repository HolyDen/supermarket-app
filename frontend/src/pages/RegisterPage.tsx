import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className='max-w-md mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Create Account
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Join us and start shopping today
        </p>
      </div>

      <div className='card'>
        <RegisterForm />
        
        <div className='mt-6 text-center'>
          <p className='text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary-600 dark:text-primary-400 hover:underline'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
