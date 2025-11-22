# 📦 StockMaster - Inventory Management System

![StockMaster](https://img.shields.io/badge/StockMaster-Inventory%20Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)

A modern, full-featured inventory management system built for the **Odoo x SPIT Hackathon 25**, featuring a stunning **Neubrutalism design** with bold borders, hard shadows, and vibrant colors.

## ✨ Features

### 🎨 Neubrutalism Design
- Bold 3px borders throughout the UI
- Hard box shadows with 4px-8px offset
- Vibrant color palette
- Bold, flat colors—no subtle gradients
- Brutalist typography with uppercase headings

### 📊 Core Functionality
- **Dashboard** – Real-time overview with statistics and charts
- **Product Management** – Full CRUD operations for inventory items
- **Categories** – Organize products with color-coded categories
- **Suppliers** – Manage supplier information and contacts
- **Stock Movement** – Track stock in, stock out, and adjustments
- **Reports & Analytics** – Visualize data with charts and graphs
- **Low Stock Alerts** – Automatic notifications for low inventory

### 🔐 Authentication
- Secure login and sign-up with Supabase
- Protected routes
- User profile management
- Password reset functionality

### 📈 Analytics
- Bar charts for product values
- Pie charts for category distribution
- Line charts for stock movement trends
- Real-time statistics cards on the dashboard

## 🚀 Tech Stack

- **Frontend:** React 19.2.0 with Vite
- **Styling:** Tailwind CSS 4.1.17 for Neubrutalism design
- **Database:** Supabase with PostgreSQL
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up free](https://supabase.com))

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd stockmaster-odoo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anonymous key
3. Open the SQL Editor in Supabase
4. Run all SQL commands from the `DATABASE_SCHEMA.md` file in order:
   - Create tables: profiles, categories, suppliers, products, stock_movements, and alerts
   - Enable Row Level Security policies
   - Create triggers and functions

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

### First-Time Setup

1. **Sign Up:** Create a new account at `/signup`
2. **Add Categories:** Navigate to Categories and create product categories
3. **Add Suppliers:** Go to Suppliers and add your supplier information
4. **Add Products:** Create products with SKU, price, quantity, etc.
5. **Track Stock:** Record stock movements (in/out/adjustment)
6. **View Analytics:** Check the Reports page for insights

### Managing Products

- **Add Product:** Click the "Add Product" button and fill in the details
- **Edit Product:** Click the edit icon in the product table
- **Delete Product:** Click the delete icon (confirmation required)
- **Search Products:** Use the search bar to filter by name or SKU

### Stock Movement

- **Stock In:** Add inventory, such as from a new purchase
- **Stock Out:** Remove inventory from sales or other purposes
- **Adjustment:** Set the exact quantity, such as after a physical count

## 🎨 Design System

### Colors

- **Primary:** Blue (#3B82F6)
- **Secondary:** Purple (#8B5CF6)
- **Success:** Green (#10B981)
- **Danger:** Red (#EF4444)
- **Warning:** Orange (#F59E0B)
- **Info:** Cyan (#06B6D4)

### Components

All components follow the neubrutalism design:
- **Buttons:** Bold borders, hard shadows, and hover animations
- **Cards:** 6px shadow offset with 3px borders
- **Inputs:** 3px borders with focus states and colored shadows
- **Tables:** Alternating row colors with bold borders
- **Modals:** 8px shadow offset with slide-in animations

## 📂 Project Structure

```
stockmaster-odoo/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Categories.jsx
│   │   ├── Suppliers.jsx
│   │   ├── StockMovement.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── config/              # Configuration
│   │   └── supabase.js
│   ├── styles/              # Styling
│   │   └── design-system.js
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── DATABASE_SCHEMA.md       # Database setup instructions
├── .env.example             # Environment variables template
└── package.json
```

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- User-specific data isolation
- Secure authentication with Supabase Auth
- Protected routes on the frontend
- SQL injection prevention via the Supabase client

## 🐛 Troubleshooting

### Cannot Connect to Supabase
- Verify that your `.env` file contains correct credentials
- Check if your Supabase project is active
- Ensure RLS policies have been created

### Products Not Showing
- Make sure you have run all SQL commands from `DATABASE_SCHEMA.md`
- Verify that you are logged in with the correct account
- Check the browser console for errors

### Charts Not Rendering
- Ensure you have data in your database
- Check if the `recharts` package is installed
- Verify that products have valid prices and quantities

## 📊 Database Schema

See `DATABASE_SCHEMA.md` for complete schema documentation, including:
- Table structures
- Relationships
- RLS policies
- Triggers and functions

## 🤝 Contributing

This project was built for the Odoo x SPIT Hackathon 25. Feel free to fork and contribute improvements!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🎯 Hackathon Submission

**Team:** CodeStorm  
**Event:** Odoo x SPIT Hackathon 25  
**Category:** Inventory Management System  
**Design Theme:** Neubrutalism  

---

Built with ❤️ using React, Supabase, and Tailwind CSS
