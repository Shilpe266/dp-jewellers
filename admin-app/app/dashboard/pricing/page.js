'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const jewelryTypes = ['Ring', 'Necklace', 'Earring', 'Bangle', 'Bracelet', 'Pendant', 'Chain', 'Anklet'];

export default function PricingPage() {
  const [metalRates, setMetalRates] = useState({
    gold14k: '',
    gold18k: '',
    gold22k: '',
    gold24k: '',
    silver: '',
    diamond: '',
  });

  const [makingCharge, setMakingCharge] = useState({
    jewelryType: '',
    chargeType: 'percentage', // 'percentage' or 'flat'
    value: '',
  });

  const [makingCharges, setMakingCharges] = useState([]);
  const [taxRate, setTaxRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingCharge, setEditingCharge] = useState(null);

  useEffect(() => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    // fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      // Fetch metal rates
      const ratesDoc = await getDoc(doc(db, 'pricing', 'metalRates'));
      if (ratesDoc.exists()) {
        setMetalRates(ratesDoc.data());
      }

      // Fetch tax rate
      const taxDoc = await getDoc(doc(db, 'pricing', 'tax'));
      if (taxDoc.exists()) {
        setTaxRate(taxDoc.data().gst || '');
      }

      // Fetch making charges
      const chargesSnapshot = await getDocs(collection(db, 'pricing', 'makingCharges', 'items'));
      const chargesList = chargesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMakingCharges(chargesList);
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError('Failed to load pricing data');
    }
  };

  const handleMetalRatesUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TEMPORARY: Bypass Firebase save (not configured yet)
      // TODO: Uncomment when Firebase is set up
      /*
      await setDoc(doc(db, 'pricing', 'metalRates'), {
        ...metalRates,
        updatedAt: new Date().toISOString(),
      });
      */
      console.log('Metal rates would be saved:', metalRates);
      setSuccess('Metal rates updated successfully! (Demo mode - not saved to Firebase)');
    } catch (err) {
      setError('Failed to update metal rates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaxUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TEMPORARY: Bypass Firebase save (not configured yet)
      /*
      await setDoc(doc(db, 'pricing', 'tax'), {
        gst: taxRate,
        updatedAt: new Date().toISOString(),
      });
      */
      console.log('Tax rate would be saved:', taxRate);
      setSuccess('Tax rate updated successfully! (Demo mode - not saved to Firebase)');
    } catch (err) {
      setError('Failed to update tax rate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMakingCharge = async () => {
    if (!makingCharge.jewelryType || !makingCharge.value) {
      setError('Please fill in all making charge fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TEMPORARY: Bypass Firebase save (not configured yet)
      /*
      if (editingCharge) {
        // Update existing charge
        await setDoc(doc(db, 'pricing', 'makingCharges', 'items', editingCharge), {
          ...makingCharge,
          updatedAt: new Date().toISOString(),
        });
        setSuccess('Making charge updated successfully!');
      } else {
        // Add new charge
        const chargeId = makingCharge.jewelryType.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'pricing', 'makingCharges', 'items', chargeId), {
          ...makingCharge,
          createdAt: new Date().toISOString(),
        });
        setSuccess('Making charge added successfully!');
      }
      */

      // Demo: Add to local state instead
      const newCharge = {
        id: makingCharge.jewelryType.toLowerCase().replace(/\s+/g, '-'),
        ...makingCharge,
      };
      setMakingCharges([...makingCharges, newCharge]);
      console.log('Making charge would be saved:', newCharge);
      setSuccess('Making charge added successfully! (Demo mode - not saved to Firebase)');

      // Reset form
      setMakingCharge({
        jewelryType: '',
        chargeType: 'percentage',
        value: '',
      });
      setEditingCharge(null);
    } catch (err) {
      setError('Failed to save making charge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCharge = (charge) => {
    setMakingCharge({
      jewelryType: charge.jewelryType,
      chargeType: charge.chargeType,
      value: charge.value,
    });
    setEditingCharge(charge.id);
  };

  const handleDeleteCharge = async (chargeId) => {
    if (!confirm('Are you sure you want to delete this making charge?')) return;

    setLoading(true);
    try {
      // TEMPORARY: Bypass Firebase delete (not configured yet)
      /*
      await deleteDoc(doc(db, 'pricing', 'makingCharges', 'items', chargeId));
      */
      // Demo: Remove from local state instead
      setMakingCharges(makingCharges.filter(charge => charge.id !== chargeId));
      console.log('Making charge would be deleted:', chargeId);
      setSuccess('Making charge deleted successfully! (Demo mode - not saved to Firebase)');
    } catch (err) {
      setError('Failed to delete making charge');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Pricing Management
      </Typography>

      {success && <Alert severity="success" className="!mb-4">{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4">{error}</Alert>}

      {/* Metal Rates Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" className="!mb-4" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Metal Rates (per gram)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>14K Gold (₹/gram)</InputLabel>
              <OutlinedInput
                type="number"
                label="14K Gold (₹/gram)"
                value={metalRates.gold14k || ''}
                onChange={(e) => setMetalRates({ ...metalRates, gold14k: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>18K Gold (₹/gram)</InputLabel>
              <OutlinedInput
                type="number"
                label="18K Gold (₹/gram)"
                value={metalRates.gold18k || ''}
                onChange={(e) => setMetalRates({ ...metalRates, gold18k: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>22K Gold (₹/gram)</InputLabel>
              <OutlinedInput
                type="number"
                label="22K Gold (₹/gram)"
                value={metalRates.gold22k || ''}
                onChange={(e) => setMetalRates({ ...metalRates, gold22k: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>24K Gold (₹/gram)</InputLabel>
              <OutlinedInput
                type="number"
                label="24K Gold (₹/gram)"
                value={metalRates.gold24k || ''}
                onChange={(e) => setMetalRates({ ...metalRates, gold24k: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Silver (₹/gram)</InputLabel>
              <OutlinedInput
                type="number"
                label="Silver (₹/gram)"
                value={metalRates.silver || ''}
                onChange={(e) => setMetalRates({ ...metalRates, silver: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Diamond (₹/carat)</InputLabel>
              <OutlinedInput
                type="number"
                label="Diamond (₹/carat)"
                value={metalRates.diamond || ''}
                onChange={(e) => setMetalRates({ ...metalRates, diamond: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleMetalRatesUpdate}
              disabled={loading}
              size="small"
              sx={{
                backgroundColor: '#1E1B4B',
                '&:hover': { backgroundColor: '#2D2963' },
                textTransform: 'none',
                height: '40px',
                px: 3,
              }}
            >
              Update Metal Rates
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tax Rate Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" className="font-bold !mb-4" sx={{ color: '#1E1B4B' }}>
          Tax Configuration
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>GST (%)</InputLabel>
              <OutlinedInput
                type="number"
                label="GST (%)"
                value={taxRate || ''}
                onChange={(e) => setTaxRate(e.target.value)}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleTaxUpdate}
              disabled={loading}
              size="small"
              sx={{
                backgroundColor: '#1E1B4B',
                '&:hover': { backgroundColor: '#2D2963' },
                textTransform: 'none',
                height: '40px',
                px: 3,
              }}
            >
              Update Tax Rate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Making Charges Section */}
      <Paper elevation={2} sx={{ p: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" className="font-bold !mb-4" sx={{ color: '#1E1B4B' }}>
          Making Charges
        </Typography>

        <Grid container spacing={3} className="!mb-6">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              select
              label="Jewelry Type"
              value={makingCharge.jewelryType || ''}
              onChange={(e) => setMakingCharge({ ...makingCharge, jewelryType: e.target.value })}
              variant="outlined"
              sx={{ minWidth: '200px' }}
            >
              {jewelryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Charge Type"
              value={makingCharge.chargeType || ''}
              onChange={(e) => setMakingCharge({ ...makingCharge, chargeType: e.target.value })}
              variant="outlined"
            >
              <MenuItem value="percentage">Percentage (%)</MenuItem>
              <MenuItem value="flat">Flat (₹)</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>
                {makingCharge.chargeType === 'percentage' ? 'Value (%)' : 'Value (₹)'}
              </InputLabel>
              <OutlinedInput
                type="number"
                label={makingCharge.chargeType === 'percentage' ? 'Value (%)' : 'Value (₹)'}
                value={makingCharge.value || ''}
                onChange={(e) => setMakingCharge({ ...makingCharge, value: e.target.value })}
                sx={{
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1E1B4B',
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAddMakingCharge}
              disabled={loading}
              size="small"
              sx={{
                backgroundColor: '#1E1B4B',
                '&:hover': { backgroundColor: '#2D2963' },
                textTransform: 'none',
                height: '40px',
              }}
              startIcon={editingCharge ? <Edit /> : <Add />}
            >
              {editingCharge ? 'Update' : 'Add'}
            </Button>
          </Grid>
        </Grid>

        <Divider className="!mb-4" />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Jewelry Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Charge Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {makingCharges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No making charges added yet
                  </TableCell>
                </TableRow>
              ) : (
                makingCharges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell>{charge.jewelryType}</TableCell>
                    <TableCell>
                      {charge.chargeType === 'percentage' ? 'Percentage' : 'Flat'}
                    </TableCell>
                    <TableCell>
                      {charge.chargeType === 'percentage'
                        ? `${charge.value}%`
                        : `₹${charge.value}`}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCharge(charge)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCharge(charge.id)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
