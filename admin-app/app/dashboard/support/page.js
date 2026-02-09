'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  WhatsApp,
  Edit,
  Close,
} from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

const defaultContactInfo = {
  storeName: 'DP Jewellers',
  address: '123 Jewellery Street, Gold Market, Mumbai, Maharashtra - 400001',
  phone: '+91 98765 43210',
  alternatePhone: '+91 98765 43211',
  email: 'support@dpjewellers.com',
  whatsapp: '+91 98765 43210',
  businessHours: {
    weekdays: '10:00 AM - 8:00 PM',
    saturday: '10:00 AM - 9:00 PM',
    sunday: '11:00 AM - 6:00 PM',
  },
};

const buttonSx = {
  backgroundColor: '#1E1B4B',
  '&:hover': { backgroundColor: '#2D2963' },
  textTransform: 'none',
  height: '40px',
  px: 3,
};

export default function SupportPage() {
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ ...defaultContactInfo });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            setIsSuperAdmin(adminDoc.data().role === 'super_admin');
          }
        } catch (err) {
          console.error('Error fetching admin data:', err);
        }

        try {
          const getContactDetails = httpsCallable(functions, 'getContactDetails');
          const result = await getContactDetails();
          if (result.data.exists) {
            const { exists, ...data } = result.data;
            setContactInfo({ ...defaultContactInfo, ...data });
          }
        } catch (err) {
          console.error('Error fetching contact details:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenDialog = () => {
    setFormData({ ...contactInfo });
    setError('');
    setSuccess('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessHoursChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!formData.storeName || !formData.address || !formData.phone || !formData.email) {
      setError('Store name, address, phone, and email are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const updateContactDetails = httpsCallable(functions, 'updateContactDetails');
      await updateContactDetails(formData);
      setContactInfo({ ...formData });
      setSuccess('Contact details updated successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Error updating contact details:', err);
      setError(err.message || 'Failed to update contact details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress sx={{ color: '#1E1B4B' }} />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Support & Contact
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              {isSuperAdmin && (
                <IconButton onClick={handleOpenDialog} size="small" sx={{ color: '#1E1B4B' }}>
                  <Edit />
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <LocationOn sx={{ color: '#1E1B4B', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Store Address
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {contactInfo.address}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <Phone sx={{ color: '#1E1B4B', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Phone Numbers
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Primary: {contactInfo.phone}
                </Typography>
                {contactInfo.alternatePhone && (
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Alternate: {contactInfo.alternatePhone}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
              <Email sx={{ color: '#1E1B4B', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {contactInfo.email}
                </Typography>
              </Box>
            </Box>

            {contactInfo.whatsapp && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <WhatsApp sx={{ color: '#25D366', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    WhatsApp
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {contactInfo.whatsapp}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Help */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#1E1B4B', fontWeight: 'bold', mb: 2 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              For any technical issues with the admin panel, please contact the development team.
              For business-related queries, use the contact information above.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" sx={{ color: '#999' }}>
              Note: This is the admin support page. Customer-facing support is handled through the mobile app and website.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Contact Details
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Store Name"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Address"
                required
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Phone"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Alternate Phone"
                value={formData.alternatePhone}
                onChange={(e) => handleChange('alternatePhone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Mon - Fri"
                value={formData.businessHours.weekdays}
                onChange={(e) => handleBusinessHoursChange('weekdays', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Saturday"
                value={formData.businessHours.saturday}
                onChange={(e) => handleBusinessHoursChange('saturday', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Sunday"
                value={formData.businessHours.sunday}
                onChange={(e) => handleBusinessHoursChange('sunday', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            sx={buttonSx}
          >
            {saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
