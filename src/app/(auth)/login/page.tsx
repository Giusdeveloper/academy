import AuthForm from '@/components/auth/AuthForm';
import './login.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">
          Accedi alla tua area personale
        </h1>
      </div>
      <div className="login-form-container">
        <AuthForm mode="login" />
      </div>
    </div>
  );
} 