import React, { useState } from 'react';
import Input from "@modules/common/components/input";
import { SubmitButton } from '@modules/checkout/components/submit-button';
import { LOGIN_VIEW } from '@modules/account/templates/login-template';
import Medusa from "@medusajs/medusa-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Backend_Url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '';
const medusa = new Medusa({ baseUrl: Backend_Url, maxRetries: 3 });

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
};

const PasswordResetRequest = ({ setCurrentView }: Props) => {
  const [email, setEmail] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Verificar se o usuário existe
      const { exists } = await medusa.auth.exists(email);
      if (!exists) {
        toast.error('No account found with the provided email.');
        return;
      }

      // Se o usuário existir, gerar o token de redefinição de senha
      await medusa.customers.generatePasswordToken({ email });
      toast.success('We have successfully sent a reset link to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again later.');
    }
  };

  return (
    <div className="max-w-sm w-full flex flex-col items-center" data-testid="reset-password-page">
      <h1 className="text-large-semi uppercase mb-6">Reset Password</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Enter your email to request a password reset link.
      </p>
      <form onSubmit={handleResetRequest} className="w-full">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Enter your email"
          required
          data-testid="email-input"
          name='email'
          label='Enter your email'
        />
        <SubmitButton className="w-full mt-6" data-testid="sign-in-button">Request Reset Link</SubmitButton>
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
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  );
};

export default PasswordResetRequest;
