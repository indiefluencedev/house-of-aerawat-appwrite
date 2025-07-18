'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSignUp } from '@clerk/nextjs';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signUp, setActive, isLoaded } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const firstNameInput = formData.get('firstName');
    const lastNameInput = formData.get('lastName');

    // Store names in state for later use
    setFirstName(firstNameInput);
    setLastName(lastNameInput);

    // Basic validation
    if (!email || !password || !firstNameInput || !lastNameInput) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Create the sign up with just email and password
      const result = await signUp.create({
        emailAddress: email,
        password: password,
      });

      // Note: firstName and lastName are typically set after email verification
      // We'll store them temporarily and set them after verification

      if (result.status === 'complete') {
        // Set names after successful signup
        try {
          await setActive({ session: result.createdSessionId });
          // Note: Names will be set after verification or during profile completion
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => router.push('/'), 2000);
        } catch (nameError) {
          console.log('Name setting skipped, proceeding with login');
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => router.push('/'), 2000);
        }
      } else if (result.status === 'missing_requirements') {
        // Check what's missing
        const missingFields = result.missingFields || [];
        const unverifiedFields = result.unverifiedFields || [];

        if (unverifiedFields.includes('email_address')) {
          // Need email verification
          await signUp.prepareEmailAddressVerification({
            strategy: 'email_code',
          });
          setPendingVerification(true);
          setSuccess('Please check your email for a verification code.');
        } else {
          setError(`Missing required fields: ${missingFields.join(', ')}`);
        }
      } else {
        // Handle other statuses
        setError('Registration incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);

      // Enhanced error handling
      if (err.errors && err.errors.length > 0) {
        const errorMessage = err.errors[0].message;
        const errorCode = err.errors[0].code;

        console.log('Error details:', {
          errorMessage,
          errorCode,
          fullError: err.errors[0],
        });

        // Handle specific error codes
        switch (errorCode) {
          case 'form_password_pwned':
            setError(
              'This password has been found in a data breach. Please choose a different password.'
            );
            break;
          case 'form_password_not_strong_enough':
            setError(
              'Password is not strong enough. Please use at least 8 characters with a mix of letters, numbers, and symbols.'
            );
            break;
          case 'form_identifier_exists':
            setError(
              'An account with this email already exists. Please sign in instead.'
            );
            break;
          case 'form_password_length_too_short':
            setError('Password must be at least 8 characters long.');
            break;
          case 'captcha_invalid':
            setError('Please complete the CAPTCHA verification.');
            break;
          default:
            if (errorMessage.toLowerCase().includes('captcha')) {
              setError('Please complete the CAPTCHA verification.');
            } else if (errorMessage.toLowerCase().includes('password')) {
              setError(
                'Password requirements not met. Please use at least 8 characters with numbers and symbols.'
              );
            } else if (errorMessage.toLowerCase().includes('email')) {
              setError('Invalid email address or email already in use.');
            } else {
              setError(errorMessage);
            }
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });

        // Try to update user profile with names after successful verification
        try {
          if (firstName || lastName) {
            // Use the user object from the session to update profile
            const user = result.createdSessionId
              ? await setActive({ session: result.createdSessionId }).then(
                  () => window.Clerk?.user
                )
              : null;

            if (user) {
              await user.update({
                firstName: firstName,
                lastName: lastName,
              });
            }
          }
        } catch (profileError) {
          console.log('Profile update skipped:', profileError);
        }

        setSuccess('Email verified successfully! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      const errorMessage =
        err.errors?.[0]?.message || 'Verification failed. Please try again.';

      if (errorMessage.toLowerCase().includes('invalid')) {
        setError(
          'Invalid verification code. Please check your email and try again.'
        );
      } else if (errorMessage.toLowerCase().includes('expired')) {
        setError('Verification code has expired. Please request a new one.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      console.error('Google sign-up error:', err);
      setError('Google sign-up failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  if (pendingVerification) {
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
              Verify Your Email
            </h2>
            <p className='text-sm text-gray-600 mb-6 text-center'>
              We've sent a verification code to your email. Please enter it
              below.
            </p>

            <form onSubmit={handleVerification}>
              <div className='flex items-center bg-gray-100 p-3 mb-4'>
                <Image
                  src='/assets/svgs/envelope.svg'
                  alt='Email Icon'
                  width={20}
                  height={20}
                  className='mr-3'
                />
                <input
                  type='text'
                  placeholder='Enter verification code'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className='w-full bg-transparent outline-none text-sm'
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-[#14397C] text-white py-3 mt-4 font-semibold hover:bg-[#D4AF37] hover:text-[#14397C] transition disabled:opacity-50'
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            {/* Add option to resend verification code */}
            <button
              onClick={async () => {
                try {
                  await signUp.prepareEmailAddressVerification({
                    strategy: 'email_code',
                  });
                  setSuccess('Verification code sent again!');
                } catch (err) {
                  setError('Failed to resend verification code.');
                }
              }}
              className='w-full text-[#14397C] text-sm mt-4 hover:underline'
              disabled={isLoading}
            >
              Resend verification code
            </button>

            {/* Messages */}
            {error && (
              <p className='text-red-500 text-sm mt-2 text-center'>{error}</p>
            )}
            {success && (
              <p className='text-green-600 text-sm mt-2 text-center'>
                {success}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            Create your Account
          </h2>

          <button
            type='button'
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
            className='w-full flex items-center justify-center border border-black py-3 mb-6 text-black font-semibold hover:bg-gray-100 transition disabled:opacity-50'
          >
            <FcGoogle className='mx-3 w-5 h-5' />
            {isGoogleLoading ? 'Signing up...' : 'Sign up using Google Account'}
          </button>

          <div className='flex items-center my-4'>
            <div className='flex-grow border-t border-gray-300' />
            <span className='mx-4 text-sm '>or continue with</span>
            <div className='flex-grow border-t border-gray-300' />
          </div>

          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className='flex items-center bg-gray-100 p-3 mb-4'>
              <Image
                src='/assets/svgs/user.svg'
                alt='User Icon'
                width={20}
                height={20}
                className='mr-3'
              />
              <input
                name='firstName'
                type='text'
                placeholder='First Name'
                className='w-full bg-transparent outline-none text-sm'
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            {/* Last Name */}
            <div className='flex items-center bg-gray-100 p-3 mb-4'>
              <Image
                src='/assets/svgs/user.svg'
                alt='User Icon'
                width={20}
                height={20}
                className='mr-3'
              />
              <input
                name='lastName'
                type='text'
                placeholder='Last Name'
                className='w-full bg-transparent outline-none text-sm'
                required
                disabled={isLoading || isGoogleLoading}
              />
            </div>

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
            <div className='flex items-center bg-gray-100 p-3 mb-4'>
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

            {/* Password requirements hint */}
            <div className='text-xs text-gray-500 mb-4'>
              Password must be at least 8 characters long and include numbers
              and symbols.
            </div>

            <button
              type='submit'
              disabled={isLoading || isGoogleLoading}
              className='w-full bg-[#14397C] text-white py-3 mt-6 font-semibold hover:bg-[#D4AF37] hover:text-[#14397C] transition disabled:opacity-50'
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-[#14397C] font-semibold hover:underline'
            >
              Sign in instead
            </Link>
          </p>

          {/* Add CAPTCHA container */}
          <div id='clerk-captcha' className='mb-6 flex justify-center'></div>
          <div className='text-xs text-center text-gray-500 mb-4'>
            This site is protected by bot detection and CAPTCHA verification.
          </div>
        </div>
      </div>
    </div>
  );
}
