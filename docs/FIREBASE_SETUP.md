# Firebase Setup Documentation

## Project Details
- **Project ID:** dp-jewellers
- **Region:** asia-south1 (Mumbai)
- **Plan:** Blaze (Pay-as-you-go)
- **Created:** February 1, 2025

## Services Enabled
- ✅ Firestore Database
- ✅ Authentication (Phone + Email/Password)
- ✅ Storage
- ✅ Cloud Functions

## Collections Structure
1. `users` - Customer data
2. `admins` - Admin users
3. `products` - Jewelry products
4. `metalRates` - Gold/Silver/Diamond rates
5. `makingCharges` - Category-wise making charges
6. `taxSettings` - GST and tax configuration
7. `coupons` - Discount coupons
8. `orders` - Customer orders
9. `stores` - Store locations
10. `banners` - Homepage banners
11. `collections` - Featured collections
12. `notifications` - Push notifications

## Admin Users
- verma.varun2810@gmail.com - super_admin
- shilpecsaxena9098@gmail.com - super_admin

## Firebase Config Files Location
- Web config: `firebase/config/firebase-config.js`
- Environment variables: `.env` (root level)