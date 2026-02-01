'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
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
            Create Admin Account
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Typography variant="body2" sx={{ color: '#666' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: '#1E1B4B' }}
            >
              Login here
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
