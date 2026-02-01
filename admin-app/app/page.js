'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // TEMPORARY: Redirect to dashboard (bypass login)
    // TODO: Change back to '/login' when Firebase is set up
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="text-primary text-xl">Loading...</div>
    </div>
  );
}
