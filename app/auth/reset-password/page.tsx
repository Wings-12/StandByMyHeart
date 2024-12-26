import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">パスワードリセット</h1>
        <PasswordResetForm />
      </div>
    </div>
  );
}