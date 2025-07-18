'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSignIn } from '@clerk/nextjs';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className='lg:min-h-screen mx-auto flex lg:items-center justify-center bg-white border-t-1'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Add a small delay to ensure the CAPTCHA has time to process
    await new Promise((resolve) => setTimeout(resolve, 500));

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // Use emailAddress instead of identifier to be consistent
      const result = await signIn.create({
        emailAddress: email,
        password: password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setSuccess('Login successful! Redirecting...');
        router.push('/');
      } else {
        // Handle other statuses like needs verification
        setError('Login requires additional verification');
      }
    } catch (err) {
      console.error('Login error:', err);

      // More detailed error handling
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        // Check for specific error types
        if (errorMessage.includes('CAPTCHA')) {
          setError('Please complete the CAPTCHA verification.');
        } else if (errorMessage.includes('password')) {
          setError('Invalid password. Please try again.');
        } else if (errorMessage.includes('identifier')) {
          setError(
            'Email not found. Please check your email or create an account.'
          );
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className='lg:min-h-screen mx-auto flex lg:items-center justify-center bg-white border-t-1'>
      <div className='w-full mx-auto lg:max-w-5xl flex py-20 lg:py-8'>
        {/* Left Image */}
        <div className='w-1/2 hidden lg:flex flex-col items-center justify-center bg-white p-10'>
          <Image
            src='/assets/verticalLogo.jpg'
            alt='House Of Aerawat'
            width={354}
            height={450}
          />
        </div>

        {/* Right Form */}
        <div className='w-full max-w-md mx-auto border-l-0 lg:w-1/2 px-4 lg:px-10 lg:py-10 lg:mt-10 lg:border-l-2 lg:border-gray-300'>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            Log in to your Account
          </h2>

          {/* Add a clerk-captcha element for Smart CAPTCHA widget */}
          <div id='clerk-captcha' className='mb-6 flex justify-center'></div>
          <div className='text-xs text-center text-gray-500 mb-4'>
            This site is protected by bot detection and CAPTCHA verification.
          </div>

          <button
            type='button'
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className='w-full flex items-center justify-center border border-black py-3 mb-6 text-black font-semibold hover:bg-gray-100 transition disabled:opacity-50'
          >
            <FcGoogle className='mx-3 w-5 h-5' />
            {isGoogleLoading ? 'Signing in...' : 'Login using Google Account'}
          </button>

          <div className='flex items-center my-4'>
            <div className='flex-grow border-t border-gray-300' />
            <span className='mx-4 text-sm '>or continue with</span>
            <div className='flex-grow border-t border-gray-300' />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className='flex items-center bg-gray-100 p-3 mb-4'>
              <Image
                src='/assets/svgs/envelope.svg'
                alt='Email Icon'
                width={20}
                height={20}
                className='mr-3'
              />
              <input
                name='email'
                type='email'
                placeholder='joesmith1234@gmail.com'
                className='w-full bg-transparent outline-none text-sm'
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            {/* Password */}
            <div className='flex items-center bg-gray-100 p-3'>
              <Image
                src='/assets/svgs/lock.svg'
                alt='Lock Icon'
                width={20}
                height={20}
                className='mr-3'
              />
              <input
                name='password'
                type='password'
                placeholder='********'
                className='w-full bg-transparent outline-none text-sm'
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <p className='text-sm text-right hover:underline cursor-pointer mt-2'>
              Forgot Password?
            </p>

            <button
              type='submit'
              disabled={isLoading || isGoogleLoading}
              className='w-full bg-[#14397C] text-white py-3 mt-10 font-semibold hover:bg-[#D4AF37] hover:text-[#14397C] transition disabled:opacity-50'
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Messages */}
          {error && (
            <p className='text-red-500 text-sm mt-2 text-center'>{error}</p>
          )}
          {success && (
            <p className='text-green-600 text-sm mt-2 text-center'>{success}</p>
          )}

          <p className='text-sm text-center mt-4 text-gray-600'>
            New to Aerawat?{' '}
            <Link
              href='/register'
              className='text-[#14397C] font-semibold hover:underline'
            >
              Sign up now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
