'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
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
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Visibility, GetApp, Edit, Store, LocalShipping } from '@mui/icons-material';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '@/lib/firebase';

const functions = getFunctions(app, 'asia-south1');

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
  const [stores, setStores] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [originalDeliveryDate, setOriginalDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchStores();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const listOrders = httpsCallable(functions, 'listOrders');
      const result = await listOrders({ limit: 100 });
      setOrders(result.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const listStores = httpsCallable(functions, 'listStores');
      const result = await listStores();
      setStores(result.data.stores || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : storeId || 'N/A';
  };

  const getStoreAddress = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return null;
    return `${store.address}, ${store.city}, ${store.state} - ${store.pincode}`;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenViewDialog(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || order.orderStatus || 'pending');
    const currentDeliveryDate = order.estimatedDeliveryDate
      ? new Date(order.estimatedDeliveryDate).toISOString().split('T')[0]
      : '';
    setEstimatedDeliveryDate(currentDeliveryDate);
    setOriginalDeliveryDate(currentDeliveryDate);
    setDelayReason('');
    setOpenEditDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateOrderStatus = httpsCallable(functions, 'updateOrderStatus');

      const updateData = {
        orderDocId: selectedOrder.id,
        newStatus,
        note: '',
      };

      // Add estimated delivery date if provided
      if (estimatedDeliveryDate) {
        updateData.estimatedDeliveryDate = estimatedDeliveryDate;
      }

      // Add delay reason if delivery date was changed
      if (estimatedDeliveryDate && originalDeliveryDate && estimatedDeliveryDate !== originalDeliveryDate && delayReason) {
        updateData.delayReason = delayReason;
        updateData.note = `Delivery date changed. Reason: ${delayReason}`;
      }

      await updateOrderStatus(updateData);

      setSuccess('Order updated successfully!');
      setOpenEditDialog(false);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order: ' + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (order) => {
    const storeName = order.deliveryType === 'pickup' || order.deliveryType === 'store_pickup'
      ? getStoreName(order.selectedStore)
      : null;
    const storeAddress = order.deliveryType === 'pickup' || order.deliveryType === 'store_pickup'
      ? getStoreAddress(order.selectedStore)
      : null;

    const receiptContent = `
DP Jewellers - Order Receipt
============================

Order ID: ${order.orderId || order.id}
Order Date: ${new Date(order.createdAt || order.orderedAt).toLocaleDateString()}
Status: ${(order.status || order.orderStatus)?.toUpperCase()}

Customer Details:
-----------------
Name: ${order.userName}
Phone: ${order.userPhone}

Order Details:
--------------
${order.items?.map((item, index) => `
${index + 1}. ${item.productName || 'Product'}
   SKU: ${item.sku || item.productCode || 'N/A'}
   Quantity: ${item.quantity || 1}
   Price: ₹${item.price || item.priceSnapshot?.itemTotal || 0}
`).join('\n')}

Delivery Type: ${order.deliveryType === 'pickup' || order.deliveryType === 'store_pickup' ? 'Store Pickup' : 'Home Delivery'}
${order.deliveryType === 'pickup' || order.deliveryType === 'store_pickup'
  ? `Pickup Store: ${storeName}\nStore Address: ${storeAddress || 'N/A'}`
  : `Delivery Address: ${formatAddress(order.shippingAddress || order.deliveryAddress)}`}

${order.estimatedDeliveryDate ? `Estimated Delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}` : ''}

Total Amount: ₹${order.totalAmount || order.orderSummary?.totalAmount || 0}

Thank you for shopping with DP Jewellers!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${order.orderId || order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = dateString?.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    const date = dateString?.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    // Handle address object
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  return (
    <div>
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1E1B4B' }}>
        Orders Management
      </Typography>

      {success && <Alert severity="success" className="!mb-4" onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" className="!mb-4" onClose={() => setError('')}>{error}</Alert>}

      <Paper elevation={2} sx={{ backgroundColor: 'white', borderRadius: 2 }}>
        <DataGrid
          rows={orders}
          columns={[
            {
              field: 'orderId',
              headerName: 'Order ID',
              width: 140,
              sortable: true,
              valueGetter: (value, row) => row.orderId || row.id?.slice(-8).toUpperCase() || '',
              renderCell: (params) => `#${params.row.orderId || params.row.id?.slice(-8).toUpperCase()}`,
            },
            {
              field: 'customer',
              headerName: 'Customer',
              flex: 1,
              minWidth: 150,
              sortable: true,
              valueGetter: (value, row) => row.userName || '',
              renderCell: (params) => (
                <Box>
                  <div>{params.row.userName}</div>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {params.row.userPhone}
                  </Typography>
                </Box>
              ),
            },
            {
              field: 'createdAt',
              headerName: 'Order Date',
              width: 160,
              sortable: true,
              valueGetter: (value, row) => row.createdAt || row.orderedAt ? new Date(row.createdAt || row.orderedAt) : null,
              renderCell: (params) => formatDate(params.row.createdAt || params.row.orderedAt),
            },
            {
              field: 'estimatedDeliveryDate',
              headerName: 'Est. Delivery',
              width: 120,
              sortable: true,
              valueGetter: (value, row) => row.estimatedDeliveryDate ? new Date(row.estimatedDeliveryDate) : null,
              renderCell: (params) => formatDateOnly(params.row.estimatedDeliveryDate),
            },
            {
              field: 'totalAmount',
              headerName: 'Amount',
              width: 120,
              sortable: true,
              valueGetter: (value, row) => row.totalAmount || row.orderSummary?.totalAmount || 0,
              renderCell: (params) => `₹${(params.row.totalAmount || params.row.orderSummary?.totalAmount || 0).toLocaleString('en-IN')}`,
            },
            {
              field: 'deliveryType',
              headerName: 'Delivery',
              width: 100,
              sortable: true,
              renderCell: (params) => (
                <Chip
                  icon={params.row.deliveryType === 'pickup' || params.row.deliveryType === 'store_pickup' ? <Store fontSize="small" /> : <LocalShipping fontSize="small" />}
                  label={params.row.deliveryType === 'pickup' || params.row.deliveryType === 'store_pickup' ? 'Pickup' : 'Delivery'}
                  size="small"
                  variant="outlined"
                />
              ),
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 140,
              sortable: true,
              valueGetter: (value, row) => row.status || row.orderStatus || 'pending',
              renderCell: (params) => (
                <Chip
                  label={(params.row.status || params.row.orderStatus)?.replace('_', ' ').toUpperCase() || 'PENDING'}
                  color={statusColors[params.row.status || params.row.orderStatus] || 'default'}
                  size="small"
                />
              ),
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 140,
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <>
                  <Tooltip title="View order details, items, and tracking history" arrow>
                    <IconButton size="small" onClick={() => handleViewOrder(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Update order status and delivery date" arrow>
                    <IconButton size="small" onClick={() => handleEditStatus(params.row)} sx={{ color: '#1E1B4B', mr: 0.5 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download order receipt as text file" arrow>
                    <IconButton size="small" onClick={() => handleDownloadReceipt(params.row)} sx={{ color: '#1E1B4B' }}>
                      <GetApp fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            },
          ]}
          getRowId={(row) => row.id}
          loading={loading && orders.length === 0}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f5f5f5', fontWeight: 'bold' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f9f9f9' },
            '& .MuiDataGrid-toolbarContainer': { p: 2, gap: 2 },
          }}
          localeText={{ noRowsLabel: 'No orders found' }}
        />
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
                    #{selectedOrder.orderId || selectedOrder.id.slice(-8).toUpperCase()}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Order Date
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {formatDate(selectedOrder.createdAt || selectedOrder.orderedAt)}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedOrder.deliveryType === 'pickup' || selectedOrder.deliveryType === 'store_pickup' ? (
                      <Store fontSize="small" sx={{ color: '#1E1B4B' }} />
                    ) : (
                      <LocalShipping fontSize="small" sx={{ color: '#1E1B4B' }} />
                    )}
                    <Typography variant="body1" className="font-semibold">
                      {selectedOrder.deliveryType === 'pickup' || selectedOrder.deliveryType === 'store_pickup' ? 'Store Pickup' : 'Home Delivery'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Status
                  </Typography>
                  <Chip
                    label={(selectedOrder.status || selectedOrder.orderStatus)?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    color={statusColors[selectedOrder.status || selectedOrder.orderStatus] || 'default'}
                    size="small"
                  />
                </Grid>

                {/* Estimated Delivery Date */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Estimated Delivery Date
                  </Typography>
                  <Typography variant="body1" className="font-semibold">
                    {selectedOrder.estimatedDeliveryDate ? formatDateOnly(selectedOrder.estimatedDeliveryDate) : 'Not set'}
                  </Typography>
                </Grid>

                {/* Delay Reason if exists */}
                {selectedOrder.delayReason && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Delay Reason
                    </Typography>
                    <Typography variant="body1" className="font-semibold" sx={{ color: '#d32f2f' }}>
                      {selectedOrder.delayReason}
                    </Typography>
                  </Grid>
                )}

                {/* Store Details for Pickup */}
                {(selectedOrder.deliveryType === 'pickup' || selectedOrder.deliveryType === 'store_pickup') && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Pickup Store
                    </Typography>
                    <Typography variant="body1" className="font-semibold">
                      {getStoreName(selectedOrder.selectedStore)}
                    </Typography>
                    {getStoreAddress(selectedOrder.selectedStore) && (
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        {getStoreAddress(selectedOrder.selectedStore)}
                      </Typography>
                    )}
                  </Grid>
                )}

                {/* Delivery Address for Home Delivery */}
                {(selectedOrder.deliveryType === 'delivery' || selectedOrder.deliveryType === 'home_delivery') && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Delivery Address
                    </Typography>
                    <Typography variant="body1" className="font-semibold">
                      {formatAddress(selectedOrder.shippingAddress || selectedOrder.deliveryAddress)}
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
                        SKU: {item.sku || item.productCode || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Quantity: {item.quantity || 1} | Price: ₹{item.price || item.priceSnapshot?.itemTotal || 0}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No items found
                </Typography>
              )}

              {/* Tracking Updates / Order History */}
              {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" className="font-bold mb-3" sx={{ color: '#1E1B4B' }}>
                    Order History
                  </Typography>
                  <Box>
                    {selectedOrder.trackingUpdates.map((update, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: '#F5F5F5',
                          borderRadius: 2,
                          borderLeft: `3px solid ${statusColors[update.status] === 'success' ? '#4caf50' : statusColors[update.status] === 'error' ? '#d32f2f' : '#1E1B4B'}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" className="font-semibold">
                            {update.status?.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {formatDate(update.timestamp)}
                          </Typography>
                        </Box>
                        {update.note && (
                          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                            {update.note}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" className="font-bold" sx={{ color: '#1E1B4B' }}>
                  Total Amount
                </Typography>
                <Typography variant="h5" className="font-bold" sx={{ color: '#1E1B4B' }}>
                  ₹{(selectedOrder.totalAmount || selectedOrder.orderSummary?.totalAmount || 0).toLocaleString('en-IN')}
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

      {/* Edit Order Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#1E1B4B', fontWeight: 'bold' }}>
          Update Order
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                select
                label="Order Status"
                value={newStatus || ''}
                onChange={(e) => setNewStatus(e.target.value)}
                variant="outlined"
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Estimated Delivery Date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Show delay reason field when delivery date is changed */}
            {originalDeliveryDate && estimatedDeliveryDate && estimatedDeliveryDate !== originalDeliveryDate && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You are changing the delivery date. Please provide a reason.
                </Alert>
                <TextField
                  fullWidth
                  size="small"
                  label="Reason for Delay"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={2}
                  placeholder="e.g., Supplier delay, Custom design processing, etc."
                  required
                />
              </Grid>
            )}
          </Grid>
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
            disabled={loading || (originalDeliveryDate && estimatedDeliveryDate && estimatedDeliveryDate !== originalDeliveryDate && !delayReason)}
            sx={{
              backgroundColor: '#1E1B4B',
              '&:hover': { backgroundColor: '#2D2963' },
              textTransform: 'none',
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
