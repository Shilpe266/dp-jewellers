'use client';

import {
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  WhatsApp,
} from '@mui/icons-material';

const contactInfo = {
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

export default function SupportPage() {
  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Support & Contact
      </Typography>

      <Grid container spacing={3}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#1E1B4B', fontWeight: 'bold', mb: 3 }}>
              Contact Information
            </Typography>

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
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Alternate: {contactInfo.alternatePhone}
                </Typography>
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
    </div>
  );
}
