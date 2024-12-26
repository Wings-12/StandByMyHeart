import { AuthForm } from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">認証</h1>
        <AuthForm />
      </div>
    </div>
  );
}