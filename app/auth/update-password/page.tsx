'use client';

import { useEffect, useState } from 'react';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth');
      } else {
        setShowForm(true);
      }
    }
  }, [user, loading, router]);

  if (!showForm) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">パスワードの更新</h1>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}