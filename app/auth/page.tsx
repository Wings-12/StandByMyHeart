import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <AuthForm />
      </div>
    </div>
  );
}