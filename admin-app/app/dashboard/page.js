'use client';

import { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import {
  AttachMoney,
  Inventory,
  ShoppingCart,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        // Fetch orders count
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnapshot.size;

        // Fetch pending orders count
        const pendingOrdersQuery = query(
          collection(db, 'orders'),
          where('status', '==', 'pending')
        );
        const pendingOrdersSnapshot = await getDocs(pendingOrdersQuery);
        const pendingOrders = pendingOrdersSnapshot.size;

        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalProducts,
          totalOrders,
          totalUsers,
          pendingOrders,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 40, color: '#1E1B4B' }} />,
      color: '#E8E5F7',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#1E1B4B' }} />,
      color: '#FFE8CC',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <TrendingUp sx={{ fontSize: 40, color: '#1E1B4B' }} />,
      color: '#FFE0E0',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 40, color: '#1E1B4B' }} />,
      color: '#D4F4DD',
    },
  ];

  return (
    <div>
      <Typography
        variant="h4"
        className="font-bold mb-6"
        sx={{ color: '#1E1B4B' }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                backgroundColor: 'white',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: card.color,
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="font-bold"
                    sx={{ color: '#1E1B4B' }}
                  >
                    {loading ? '...' : card.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={2}
          sx={{ p: 4, backgroundColor: 'white', borderRadius: 2 }}
        >
          <Typography
            variant="h6"
            className="font-bold mb-4"
            sx={{ color: '#1E1B4B' }}
          >
            Quick Actions
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Welcome to DP Jewellers Admin Panel. Use the sidebar to navigate between different sections.
          </Typography>
        </Paper>
      </Box>
    </div>
  );
}
