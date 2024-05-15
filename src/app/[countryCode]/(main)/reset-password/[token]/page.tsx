"use client";
import React, { useState, useEffect } from 'react';
import Input from "@modules/common/components/input";
import { SubmitButton } from '@modules/checkout/components/submit-button';
import Medusa from "@medusajs/medusa-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Backend_Url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '';
const medusa = new Medusa({ baseUrl: Backend_Url, maxRetries: 3 });

const ResetPassword = () => {
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenFromUrl = url.pathname.split('/').pop();
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const validatePassword = (password: string) => {
    const validations = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
    return Object.values(validations).every(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validatePassword(password);

    if (!isValid) {
      toast.error('Password does not meet all requirements!');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match! Please try again.');
      return;
    }

    try {
      await medusa.customers.resetPassword({
        token: token,
        password: password,
        email: email,
      });
      toast.success('Password updated successfully!');
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/account`;
      }, 5000);
    } catch (error) {
      toast.error('Failed to reset password! Please try again later.');
    }
  };

  return (
    <div className="flex justify-center mb-24">
      <div className="max-w-sm w-full flex flex-col items-center p-6 bg-white shadow-md rounded-lg" data-testid="reset-password-page" style={{ marginTop: '10vh' }}>
        <h1 className="text-large-semi uppercase mb-6">Reset Password</h1>
        <p className="text-center text-base-regular text-ui-fg-base mb-8">
          Enter your new password.
        </p>
        <form onSubmit={handlePasswordReset} className="w-full gap-4">
          <div className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              title="Enter your email"
              autoComplete="email"
              required
              data-testid="email-input" 
              name='email'
              label='Email'           
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              title="Enter your new password"
              required
              data-testid="password-input" 
              name='password' 
              label='New password'            
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              title="Confirm your new password"
              required
              data-testid="confirm-password-input" 
              name='confirmPassword'
              label='Confirm Password'           
            />
            <ul className="text-sm mt-2">
              <li className={passwordValidations.minLength ? 'text-green-600' : 'text-red-600'}>
                {passwordValidations.minLength ? '✔' : '✘'} Minimum 8 characters
              </li>
              <li className={passwordValidations.uppercase ? 'text-green-600' : 'text-red-600'}>
                {passwordValidations.uppercase ? '✔' : '✘'} At least one uppercase letter
              </li>
              <li className={passwordValidations.lowercase ? 'text-green-600' : 'text-red-600'}>
                {passwordValidations.lowercase ? '✔' : '✘'} At least one lowercase letter
              </li>
              <li className={passwordValidations.number ? 'text-green-600' : 'text-red-600'}>
                {passwordValidations.number ? '✔' : '✘'} At least one number
              </li>
              <li className={passwordValidations.specialChar ? 'text-green-600' : 'text-red-600'}>
                {passwordValidations.specialChar ? '✔' : '✘'} At least one special character
              </li>
            </ul>
            <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          </div>
          <SubmitButton className="w-full mt-6" data-testid="reset-password-button">Reset Password</SubmitButton>
          
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
