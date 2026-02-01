# DP Jewellers - Admin Panel

A premium admin dashboard for managing DP Jewellers' jewelry catalog, pricing, orders, and customers.

## Features

### 1. Authentication
- Admin login and registration with Firebase Authentication
- Secure email/password authentication
- Session management with automatic redirects

### 2. Pricing Management
- **Metal Rates**: Set real-time prices for 22K Gold, 24K Gold, Silver, and Diamond
- **Making Charges**: Configure making charges by jewelry type (Ring, Necklace, Earring, etc.)
  - Support for both percentage-based and flat rate charges
  - Easy add, edit, and delete operations
- **Tax Configuration**: Set GST percentage
- All pricing updates sync instantly to Firebase and mobile app

### 3. Product/Jewelry Management
- Complete CRUD operations for jewelry products
- Product details:
  - Name, SKU, Category
  - Material (Gold, Silver, Diamond, Platinum)
  - Purity (18K, 22K, 24K, Silver 925)
  - Net Weight & Gross Weight
  - Stone Details
  - HUID Number
  - Description
  - Base Price
  - Active/Inactive status
- Multi-image upload support
- Product visibility control

### 4. Order Management
- View all customer orders
- Order details including:
  - Customer information
  - Order items
  - Delivery type (Pickup/Delivery)
  - Delivery address
  - Total amount
- Order status management with multiple states:
  - Pending, Confirmed, Processing
  - Ready for Pickup, Out for Delivery
  - Delivered, Completed, Cancelled
- Download order receipts

### 5. User Management
- View all registered customers
- User details and order history
- Edit user information
- Activate/Deactivate users
- Delete user accounts

### 6. Dashboard
- Overview statistics:
  - Total Products
  - Total Orders
  - Pending Orders
  - Total Users
- Quick access to all features

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase
  - Firestore (Database)
  - Firebase Storage (Images)
  - Firebase Authentication
- **Icons**: Material Icons

## Color Scheme

- **Primary**: `#1E1B4B` (Deep Blue)
- **Secondary**: `#FFFDF2` (Cream/Off-white)
- **White**: `#FFFFFF`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. Copy your Firebase configuration
4. Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

5. Add your Firebase credentials to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Set Up Firestore Database

Create the following collections in Firestore:

#### Collection: `pricing`
- Document: `metalRates`
  ```json
  {
    "gold22k": "6500",
    "gold24k": "7000",
    "silver": "80",
    "diamond": "50000",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

- Document: `tax`
  ```json
  {
    "gst": "3",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
  ```

- Subcollection: `makingCharges/items/*`
  - Each document represents a making charge for a jewelry type

#### Collection: `products`
- Auto-generated documents for each product

#### Collection: `orders`
- Auto-generated documents for each order

#### Collection: `users`
- Auto-generated documents for each user

### 4. Set Up Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Set Up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Pricing data
    match /pricing/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 7. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
admin-app/
├── app/
│   ├── dashboard/
│   │   ├── layout.js          # Dashboard layout with sidebar
│   │   ├── page.js            # Dashboard home with stats
│   │   ├── pricing/
│   │   │   └── page.js        # Pricing management
│   │   ├── products/
│   │   │   └── page.js        # Product CRUD
│   │   ├── orders/
│   │   │   └── page.js        # Order management
│   │   └── users/
│   │       └── page.js        # User management
│   ├── login/
│   │   └── page.js            # Login page
│   ├── register/
│   │   └── page.js            # Registration page
│   ├── layout.js              # Root layout
│   ├── page.js                # Home page (redirects to login)
│   └── globals.css            # Global styles
├── components/
│   └── Sidebar.js             # Sidebar navigation component
├── lib/
│   └── firebase.js            # Firebase configuration
├── public/                     # Static assets
├── .env.local.example         # Environment variables template
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies
```

## Key Features Implementation

### Real-Time Pricing
When you update metal rates or making charges in the admin panel, they are saved to Firebase Firestore. The mobile app uses real-time listeners to instantly reflect these changes without requiring app restart.

### Image Upload
Product images are uploaded to Firebase Storage and URLs are stored in Firestore. The mobile app fetches these URLs to display high-quality jewelry images.

### Order Status Updates
As you update order statuses in the admin panel, customers can see the updated status in their mobile app in real-time.

## Default Admin Account

After setting up, create your first admin account by:
1. Go to `/register`
2. Create an account with your email and password
3. Use these credentials to login

## Support

For issues or questions, contact the development team.

## License

© 2024 DP Jewellers. All rights reserved.
