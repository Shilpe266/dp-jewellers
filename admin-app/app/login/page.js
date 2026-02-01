'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <Paper
        elevation={3}
        className="p-8 max-w-md w-full"
        sx={{ backgroundColor: 'white', borderRadius: 2 }}
      >
        <div className="text-center mb-6">
          <Typography
            variant="h4"
            className="font-bold mb-2"
            sx={{ color: '#1E1B4B' }}
          >
            DP Jewellers
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#666' }}
          >
            Admin Panel
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#1E1B4B',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1E1B4B',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#1E1B4B',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#1E1B4B',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': {
                backgroundColor: '#2D2963',
              },
              padding: '12px',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Typography variant="body2" sx={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold"
              style={{ color: '#1E1B4B' }}
            >
              Register here
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
