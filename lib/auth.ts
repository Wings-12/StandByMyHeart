import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  });

  if (error) {
    if (error.message === 'User already registered') {
      throw new AuthError('このメールアドレスは既に登録されています');
    }
    throw new AuthError(error.message);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === 'Invalid login credentials') {
      throw new AuthError('メールアドレスまたはパスワードが正しくありません');
    }
    if (error.message === 'Email not confirmed') {
      throw new AuthError('メールアドレスが確認されていません。確認メールをご確認ください。');
    }
    throw new AuthError(error.message);
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AuthError(error.message);
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });

  if (error) {
    if (error.message === 'User not found') {
      throw new AuthError('このメールアドレスは登録されていません');
    }
    throw new AuthError(error.message);
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new AuthError(error.message);
  }
}