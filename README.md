# Esprit Livre - Admin Panel

A modern, responsive admin panel for the Esprit Livre e-commerce bookstore platform. Built with React, Vite, and Tailwind CSS v4.

## Features

- **Dashboard**: Overview with stats cards, sales chart, and recent orders
- **Books Management**: Full CRUD operations with search, sort, and responsive table/card views
- **Orders Management**: View and update order status with detailed order information
- **Users Management**: User account management with role assignment and status toggles
- **Authentication**: Simple mock authentication system
- **Responsive Design**: Desktop-first design that works beautifully on mobile
- **Animations**: Smooth transitions and interactions using Framer Motion
- **Mock Data**: Fully functional with mock API and sample data

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart components
- **Lucide React** - Icon library

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Default Login

The application uses mock authentication. You can login with **any email and password**:

- Example: `admin@espritlivre.fr` / `password123`

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── StatsCard.jsx
│   │   └── UploadImageInput.jsx
│   ├── layout/
│   │   └── Layout.jsx    # Main layout wrapper
│   ├── dashboard/
│   │   ├── SalesChart.jsx
│   │   └── RecentOrdersTable.jsx
│   ├── books/
│   │   ├── BooksTable.jsx
│   │   └── BookForm.jsx
│   ├── orders/
│   │   ├── OrdersTable.jsx
│   │   ├── OrderStatusBadge.jsx
│   │   └── OrderDetailsModal.jsx
│   └── users/
│       ├── UsersTable.jsx
│       └── UserDetailsModal.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Books.jsx
│   ├── Orders.jsx
│   ├── Users.jsx
│   ├── Login.jsx
│   └── NotFound.jsx
├── router/
│   └── AdminRoutes.jsx   # Route configuration
├── mock/
│   └── mockApi.js        # Mock API with simulated data
├── utils/
│   └── format.js         # Utility functions
├── App.jsx
└── main.jsx
```

## Routes

| Path | Description |
|------|-------------|
| `/admin/login` | Login page |
| `/admin/dashboard` | Dashboard with stats and charts |
| `/admin/books` | Books management |
| `/admin/orders` | Orders management |
| `/admin/users` | Users management |
| `*` | 404 Not Found page |

## Features by Page

### Dashboard
- 3 statistics cards (Total Books, Total Users, Monthly Sales)
- Weekly sales area chart
- Recent orders table with quick actions

### Books
- Searchable book list
- Add/Edit/Delete books
- Book form with image upload (base64 preview)
- Categories: Fiction, Non-Fiction, Technology, Science, Biography, Self-Help, Psychology, Business
- Responsive table view (desktop) and card view (mobile)

### Orders
- Filter by status (All, Pending, Shipped, Delivered, Cancelled)
- Sort by date or total
- View order details modal with item list
- Update order status

### Users
- Search by name or email
- View user details (total orders, total spent)
- Toggle user active/inactive status
- Update user role (USER/ADMIN)

## Mock API

All data operations use mock APIs located in `src/mock/mockApi.js`:

- **Books**: getBooks, getBookById, createBook, updateBook, deleteBook
- **Orders**: getOrders, getOrderById, updateOrderStatus, getRecentOrders
- **Users**: getUsers, getUserById, toggleUserActive, updateUserRole
- **Stats**: getStats, getSalesChartData

All operations simulate network latency (500ms delay).

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Color Palette

- **Primary**: Blue (#2563EB)
- **Accent**: Red (#DC2626)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#EAB308)
- **Neutrals**: Gray scale

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use this project for your own purposes.

---

Built with ❤️ for Esprit Livre
