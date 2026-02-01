'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { Visibility, GetApp, Edit } from '@mui/icons-material';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const orderStatuses = [
  'pending',
  'confirmed',
  'processing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
];

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  ready_for_pickup: 'primary',
  out_for_delivery: 'primary',
  delivered: 'success',
  completed: 'success',
  cancelled: 'error',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    // fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // TEMPORARY: Disable Firebase fetch until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const ordersList = await Promise.all(
        snapshot.docs.map(async (orderDoc) => {
          const orderData = orderDoc.data();

          // Fetch user details
          let userName = 'N/A';
          let userPhone = 'N/A';
          if (orderData.userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', orderData.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userName = userData.name || userData.email || 'N/A';
                userPhone = userData.phone || 'N/A';
              }
            } catch (err) {
              console.error('Error fetching user:', err);
            }
          }

          return {
            id: orderDoc.id,
            ...orderData,
            userName,
            userPhone,
          };
        })
      );

      // Sort by creation date (newest first)
      ordersList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setOrders(ordersList);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    }
    */
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setOpenEditDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // TEMPORARY: Disable Firebase update until it's configured
    // TODO: Uncomment when Firebase is set up
    /*
    try {
      await updateDoc(doc(db, 'orders', selectedOrder.id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Order status updated successfully!');
      setOpenEditDialog(false);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setLoading(false);
    }
    */

    // Demo mode - show success message without Firebase
    setSuccess('Order status updated successfully! (Demo mode - not saved to Firebase)');
    setLoading(false);
    setOpenEditDialog(false);
  };

  const handleDownloadReceipt = (order) => {
    // Generate a simple receipt
    const receiptContent = `
DP Jewellers - Order Receipt
============================

Order ID: ${order.id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status?.toUpperCase()}

Customer Details:
-----------------
Name: ${order.userName}
Phone: ${order.userPhone}

Order Details:
--------------
${order.items?.map((item, index) => `
${index + 1}. ${item.productName || 'Product'}
   SKU: ${item.sku || 'N/A'}
   Quantity: ${item.quantity || 1}
   Price: ₹${item.price || 0}
`).join('\n')}

Delivery Type: ${order.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
${order.deliveryType === 'delivery' ? `Delivery Address: ${order.deliveryAddress || 'N/A'}` : ''}

Total Amount: ₹${order.totalAmount || 0}

Thank you for shopping with DP Jewellers!
    `;

    // Create a blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Orders Management
      </Typography>

      {success && <Alert severity="success" className="!mb-4">{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4">{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Delivery</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id.slice(-8).toUpperCase()}</TableCell>
                    <TableCell>
                      <div>{order.userName}</div>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {order.userPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>₹{order.totalAmount || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                        color={statusColors[order.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewOrder(order)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditStatus(order)}
                        sx={{ color: '#1E1B4B', mr: 1 }}
                        title="Update Status"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReceipt(order)}
                        sx={{ color: '#1E1B4B' }}
                        title="Download Receipt"
                      >
                        <GetApp />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Order Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Order Details
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Order ID
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    #{selectedOrder.id.slice(-8).toUpperCase()}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Order Date
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Customer Name
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedOrder.userName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedOrder.userPhone}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Delivery Type
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedOrder.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedOrder.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    color={statusColors[selectedOrder.status] || 'default'}
                    size="small"
                  />
                </Grid>

                {selectedOrder.deliveryType === 'delivery' && selectedOrder.deliveryAddress && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Delivery Address
                    </Typography>
                    <Typography variant="body1" className="font-semibold">
                      {selectedOrder.deliveryAddress}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" className="font-bold mb-3" sx={{ color: '#1E1B4B' }}>
                Order Items
              </Typography>

              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <Box>
                  {selectedOrder.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        mb: 2,
                        backgroundColor: '#F5F5F5',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1" className="font-semibold">
                        {item.productName || 'Product'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        SKU: {item.sku || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Quantity: {item.quantity || 1} | Price: ₹{item.price || 0}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No items found
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" className="font-bold" sx={{ color: '#1E1B4B' }}>
                  Total Amount
                </Typography>
                <Typography variant="h5" className="font-bold" sx={{ color: '#1E1B4B' }}>
                  ₹{selectedOrder.totalAmount || 0}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenViewDialog(false)}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Close
          </Button>
          <Button
            onClick={() => handleDownloadReceipt(selectedOrder)}
            variant="contained"
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': { backgroundColor: '#2D2963' },
              textTransform: 'none',
            }}
            startIcon={<GetApp />}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Update Order Status
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            select
            label="Order Status"
            value={newStatus || ''}
            onChange={(e) => setNewStatus(e.target.value)}
            variant="outlined"
            sx={{ mt: 2, minWidth: '200px' }}
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': { backgroundColor: '#2D2963' },
              textTransform: 'none',
            }}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
