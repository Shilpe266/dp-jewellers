'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Box,
  OutlinedInput,
  InputLabel,
  FormControl,
  CircularProgress,
  Chip,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

const inputSx = {
  height: '40px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1E1B4B' },
};

const buttonSx = {
  backgroundColor: '#1E1B4B',
  '&:hover': { backgroundColor: '#2D2963' },
  textTransform: 'none',
  height: '40px',
  px: 3,
};

export default function PricingPage() {
  const [metalRates, setMetalRates] = useState({
    gold24K: '', gold22K: '', gold18K: '', gold14K: '',
    silver925: '', silver999: '',
    platinum950: '',
    diamondSI_IJ: '', diamondSI_GH: '', diamondVS_GH: '', diamondVVS_EF: '', diamondIF_DEF: '',
  });
  const [lastRateUpdate, setLastRateUpdate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const getMetalRates = httpsCallable(functions, 'getMetalRates');
      const result = await getMetalRates();
      const data = result.data;
      setMetalRates({
        gold24K: data.gold?.['24K'] || '',
        gold22K: data.gold?.['22K'] || '',
        gold18K: data.gold?.['18K'] || '',
        gold14K: data.gold?.['14K'] || '',
        silver925: data.silver?.['925_sterling'] || '',
        silver999: data.silver?.['999_pure'] || '',
        platinum950: data.platinum?.['950'] || data.platinum?.perGram || '',
        diamondSI_IJ: data.diamond?.SI_IJ || '',
        diamondSI_GH: data.diamond?.SI_GH || '',
        diamondVS_GH: data.diamond?.VS_GH || '',
        diamondVVS_EF: data.diamond?.VVS_EF || '',
        diamondIF_DEF: data.diamond?.IF_DEF || '',
      });
      if (data.updatedAt) {
        setLastRateUpdate(data.updatedAt._seconds ? new Date(data.updatedAt._seconds * 1000) : new Date(data.updatedAt));
      }
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError('Failed to load pricing data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleMetalRatesUpdate = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateMetalRates = httpsCallable(functions, 'updateMetalRates');
      await updateMetalRates({
        gold: {
          '24K': Number(metalRates.gold24K) || 0,
          '22K': Number(metalRates.gold22K) || 0,
          '18K': Number(metalRates.gold18K) || 0,
          '14K': Number(metalRates.gold14K) || 0,
        },
        silver: {
          '925_sterling': Number(metalRates.silver925) || 0,
          '999_pure': Number(metalRates.silver999) || 0,
        },
        platinum: {
          '950': Number(metalRates.platinum950) || 0,
          perGram: Number(metalRates.platinum950) || 0,
        },
        diamond: {
          SI_IJ: Number(metalRates.diamondSI_IJ) || 0,
          SI_GH: Number(metalRates.diamondSI_GH) || 0,
          VS_GH: Number(metalRates.diamondVS_GH) || 0,
          VVS_EF: Number(metalRates.diamondVVS_EF) || 0,
          IF_DEF: Number(metalRates.diamondIF_DEF) || 0,
        },
      });
      setLastRateUpdate(new Date());
      setSuccess('Metal rates updated! All product prices will be recalculated automatically.');
    } catch (err) {
      setError('Failed to update metal rates: ' + (err.message || ''));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#1E1B4B' }} />
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" className="font-bold" sx={{ color: '#1E1B4B' }}>
          Pricing Management
        </Typography>
        {lastRateUpdate && (
          <Chip
            icon={<AccessTime />}
            label={`Last updated: ${lastRateUpdate.toLocaleString('en-IN')}`}
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      {success && <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4" onClose={() => setError('')}>{error}</Alert>}

      {/* Metal Rates Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" className="!mb-2" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Gold Rates (per gram)
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          Update daily gold rates. All product prices will recalculate automatically.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>24K Gold (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="24K Gold (₹/gram)"
                value={metalRates.gold24K}
                onChange={(e) => setMetalRates({ ...metalRates, gold24K: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>22K Gold (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="22K Gold (₹/gram)"
                value={metalRates.gold22K}
                onChange={(e) => setMetalRates({ ...metalRates, gold22K: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>18K Gold (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="18K Gold (₹/gram)"
                value={metalRates.gold18K}
                onChange={(e) => setMetalRates({ ...metalRates, gold18K: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>14K Gold (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="14K Gold (₹/gram)"
                value={metalRates.gold14K}
                onChange={(e) => setMetalRates({ ...metalRates, gold14K: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" className="!mt-6 !mb-2" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Silver Rates (per gram)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>925 Sterling (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="925 Sterling (₹/gram)"
                value={metalRates.silver925}
                onChange={(e) => setMetalRates({ ...metalRates, silver925: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>999 Pure (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="999 Pure (₹/gram)"
                value={metalRates.silver999}
                onChange={(e) => setMetalRates({ ...metalRates, silver999: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" className="!mt-6 !mb-2" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Platinum Rates (per gram)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>950 Platinum (₹/gram)</InputLabel>
              <OutlinedInput type="number" label="950 Platinum (₹/gram)"
                value={metalRates.platinum950}
                onChange={(e) => setMetalRates({ ...metalRates, platinum950: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" className="!mt-6 !mb-2" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Diamond Rates (per carat)
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Rates by clarity-color grade combination.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>SI I-J (₹/ct)</InputLabel>
              <OutlinedInput type="number" label="SI I-J (₹/ct)"
                value={metalRates.diamondSI_IJ}
                onChange={(e) => setMetalRates({ ...metalRates, diamondSI_IJ: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>SI G-H (₹/ct)</InputLabel>
              <OutlinedInput type="number" label="SI G-H (₹/ct)"
                value={metalRates.diamondSI_GH}
                onChange={(e) => setMetalRates({ ...metalRates, diamondSI_GH: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>VS G-H (₹/ct)</InputLabel>
              <OutlinedInput type="number" label="VS G-H (₹/ct)"
                value={metalRates.diamondVS_GH}
                onChange={(e) => setMetalRates({ ...metalRates, diamondVS_GH: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>VVS E-F (₹/ct)</InputLabel>
              <OutlinedInput type="number" label="VVS E-F (₹/ct)"
                value={metalRates.diamondVVS_EF}
                onChange={(e) => setMetalRates({ ...metalRates, diamondVVS_EF: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <FormControl fullWidth size="small">
              <InputLabel>IF D-F (₹/ct)</InputLabel>
              <OutlinedInput type="number" label="IF D-F (₹/ct)"
                value={metalRates.diamondIF_DEF}
                onChange={(e) => setMetalRates({ ...metalRates, diamondIF_DEF: e.target.value })}
                sx={inputSx}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleMetalRatesUpdate}
            disabled={saving}
            size="small"
            sx={buttonSx}
          >
            {saving ? 'Saving...' : 'Update All Rates'}
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
