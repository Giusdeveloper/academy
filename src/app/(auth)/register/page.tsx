import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import './register.css';

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">
          Crea il tuo account
        </h1>
      </div>
      <div className="register-form-container">
        <Suspense fallback={<div>Caricamento...</div>}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </div>
  );
} 