// Mock database
let books = [
  { id: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', price: 12.99, stock: 45, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
  { id: 2, title: '1984', author: 'George Orwell', price: 15.50, stock: 23, status: 'active', category: 'Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', price: 22.00, stock: 12, status: 'active', category: 'Non-Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
  { id: 4, title: 'Clean Code', author: 'Robert C. Martin', price: 45.99, stock: 8, status: 'active', category: 'Technology', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
  { id: 5, title: "L'Étranger", author: 'Albert Camus', price: 9.99, stock: 67, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
  { id: 6, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: 18.75, stock: 0, status: 'out_of_stock', category: 'Psychology', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  { id: 7, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 11.50, stock: 34, status: 'active', category: 'Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
  { id: 8, title: 'Atomic Habits', author: 'James Clear', price: 19.99, stock: 56, status: 'active', category: 'Self-Help', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { id: 9, title: 'The Alchemist', author: 'Paulo Coelho', price: 14.25, stock: 41, status: 'active', category: 'Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
  { id: 10, title: 'Educated', author: 'Tara Westover', price: 16.50, stock: 29, status: 'active', category: 'Biography', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { id: 11, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 13.99, stock: 52, status: 'active', category: 'Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  { id: 12, title: 'Les Misérables', author: 'Victor Hugo', price: 24.99, stock: 18, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
  { id: 13, title: 'The Lean Startup', author: 'Eric Ries', price: 28.50, stock: 15, status: 'active', category: 'Business', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
  { id: 14, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', price: 18.99, stock: 64, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { id: 15, title: 'The Power of Now', author: 'Eckhart Tolle', price: 17.25, stock: 38, status: 'active', category: 'Self-Help', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
  { id: 16, title: 'Steve Jobs', author: 'Walter Isaacson', price: 21.99, stock: 0, status: 'out_of_stock', category: 'Biography', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { id: 17, title: 'La Peste', author: 'Albert Camus', price: 11.99, stock: 42, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400' },
  { id: 18, title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', price: 19.50, stock: 27, status: 'active', category: 'Self-Help', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
  { id: 19, title: 'Brave New World', author: 'Aldous Huxley', price: 14.99, stock: 31, status: 'active', category: 'Fiction', language: 'Anglais', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
  { id: 20, title: 'L\'Assommoir', author: 'Émile Zola', price: 13.50, stock: 19, status: 'active', category: 'Fiction', language: 'Français', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
];

let orders = [
  { id: 1001, orderNumber: 'ORD-1001', customer: 'Marie Dubois', customerEmail: 'marie.dubois@email.fr', total: 58.48, status: 'delivered', date: '2025-10-10T14:30:00', items: [{ bookId: 1, title: 'Le Petit Prince', quantity: 2, price: 12.99, language: 'Français' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }, { bookId: 5, title: "L'Étranger", quantity: 1, price: 9.99, language: 'Français' }] },
  { id: 1002, orderNumber: 'ORD-1002', customer: 'Jean Martin', customerEmail: 'jean.martin@email.fr', total: 45.99, status: 'shipped', date: '2025-10-12T09:15:00', items: [{ bookId: 4, title: 'Clean Code', quantity: 1, price: 45.99, language: 'Anglais' }] },
  { id: 1003, orderNumber: 'ORD-1003', customer: 'Sophie Bernard', customerEmail: 'sophie.b@email.fr', total: 73.48, status: 'pending', date: '2025-10-14T16:45:00', items: [{ bookId: 2, title: '1984', quantity: 1, price: 15.50, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }, { bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1004, orderNumber: 'ORD-1004', customer: 'Pierre Lefebvre', customerEmail: 'p.lefebvre@email.fr', total: 31.00, status: 'pending', date: '2025-10-14T11:20:00', items: [{ bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1005, orderNumber: 'ORD-1005', customer: 'Claire Rousseau', customerEmail: 'claire.rousseau@email.fr', total: 28.49, status: 'shipped', date: '2025-10-13T13:00:00', items: [{ bookId: 1, title: 'Le Petit Prince', quantity: 1, price: 12.99, language: 'Français' }, { bookId: 2, title: '1984', quantity: 1, price: 15.50, language: 'Anglais' }] },
  { id: 1006, orderNumber: 'ORD-1006', customer: 'Lucas Moreau', customerEmail: 'lucas.m@email.fr', total: 50.74, status: 'delivered', date: '2025-10-09T10:30:00', items: [{ bookId: 9, title: 'The Alchemist', quantity: 2, price: 14.25, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1007, orderNumber: 'ORD-1007', customer: 'Emma Petit', customerEmail: 'emma.petit@email.fr', total: 19.99, status: 'cancelled', date: '2025-10-08T15:45:00', items: [{ bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1008, orderNumber: 'ORD-1008', customer: 'Thomas Durand', customerEmail: 'thomas.d@email.fr', total: 91.48, status: 'pending', date: '2025-10-15T08:00:00', items: [{ bookId: 4, title: 'Clean Code', quantity: 1, price: 45.99, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }, { bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 1, title: 'Le Petit Prince', quantity: 1, price: 12.99, language: 'Français' }] },
  { id: 1009, orderNumber: 'ORD-1009', customer: 'Antoine Leroy', customerEmail: 'antoine.leroy@email.fr', total: 37.49, status: 'delivered', date: '2025-10-07T11:20:00', items: [{ bookId: 2, title: '1984', quantity: 1, price: 15.50, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1010, orderNumber: 'ORD-1010', customer: 'Camille Blanc', customerEmail: 'camille.blanc@email.fr', total: 62.48, status: 'shipped', date: '2025-10-11T16:30:00', items: [{ bookId: 4, title: 'Clean Code', quantity: 1, price: 45.99, language: 'Anglais' }, { bookId: 10, title: 'Educated', quantity: 1, price: 16.50, language: 'Anglais' }] },
  { id: 1011, orderNumber: 'ORD-1011', customer: 'Alexandre Dupont', customerEmail: 'alex.dupont@email.fr', total: 45.98, status: 'pending', date: '2025-10-16T09:00:00', items: [{ bookId: 1, title: 'Le Petit Prince', quantity: 2, price: 12.99, language: 'Français' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1012, orderNumber: 'ORD-1012', customer: 'Isabelle Mercier', customerEmail: 'isabelle.m@email.fr', total: 33.74, status: 'delivered', date: '2025-10-06T14:15:00', items: [{ bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1013, orderNumber: 'ORD-1013', customer: 'Julien Gauthier', customerEmail: 'julien.g@email.fr', total: 54.73, status: 'pending', date: '2025-10-17T10:45:00', items: [{ bookId: 9, title: 'The Alchemist', quantity: 1, price: 14.25, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 2, price: 19.99, language: 'Anglais' }] },
  { id: 1014, orderNumber: 'ORD-1014', customer: 'Nathalie Vincent', customerEmail: 'nathalie.v@email.fr', total: 28.50, status: 'shipped', date: '2025-10-05T13:20:00', items: [{ bookId: 2, title: '1984', quantity: 1, price: 15.50, language: 'Anglais' }, { bookId: 1, title: 'Le Petit Prince', quantity: 1, price: 12.99, language: 'Français' }] },
  { id: 1015, orderNumber: 'ORD-1015', customer: 'Olivier Renard', customerEmail: 'olivier.renard@email.fr', total: 67.99, status: 'delivered', date: '2025-10-04T12:30:00', items: [{ bookId: 4, title: 'Clean Code', quantity: 1, price: 45.99, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1016, orderNumber: 'ORD-1016', customer: 'Pauline Chevalier', customerEmail: 'pauline.c@email.fr', total: 41.49, status: 'cancelled', date: '2025-10-03T15:00:00', items: [{ bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }, { bookId: 10, title: 'Educated', quantity: 1, price: 16.50, language: 'Anglais' }, { bookId: 5, title: "L'Étranger", quantity: 1, price: 9.99, language: 'Français' }] },
  { id: 1017, orderNumber: 'ORD-1017', customer: 'Quentin Marchand', customerEmail: 'quentin.m@email.fr', total: 22.99, status: 'pending', date: '2025-10-18T08:30:00', items: [{ bookId: 1, title: 'Le Petit Prince', quantity: 1, price: 12.99, language: 'Français' }, { bookId: 5, title: "L'Étranger", quantity: 1, price: 9.99, language: 'Français' }] },
  { id: 1018, orderNumber: 'ORD-1018', customer: 'Rachel Lambert', customerEmail: 'rachel.lambert@email.fr', total: 56.49, status: 'shipped', date: '2025-10-02T17:45:00', items: [{ bookId: 9, title: 'The Alchemist', quantity: 1, price: 14.25, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1019, orderNumber: 'ORD-1019', customer: 'Sébastien Faure', customerEmail: 'sebastien.f@email.fr', total: 26.00, status: 'delivered', date: '2025-10-01T11:00:00', items: [{ bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 9, title: 'The Alchemist', quantity: 1, price: 14.25, language: 'Anglais' }] },
  { id: 1020, orderNumber: 'ORD-1020', customer: 'Valérie Bertrand', customerEmail: 'valerie.b@email.fr', total: 79.98, status: 'pending', date: '2025-10-19T14:20:00', items: [{ bookId: 4, title: 'Clean Code', quantity: 1, price: 45.99, language: 'Anglais' }, { bookId: 10, title: 'Educated', quantity: 2, price: 16.50, language: 'Anglais' }] },
  { id: 1021, orderNumber: 'ORD-1021', customer: 'Xavier Fournier', customerEmail: 'xavier.fournier@email.fr', total: 35.49, status: 'shipped', date: '2025-09-30T10:15:00', items: [{ bookId: 2, title: '1984', quantity: 1, price: 15.50, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1022, orderNumber: 'ORD-1022', customer: 'Yves Garnier', customerEmail: 'yves.garnier@email.fr', total: 48.48, status: 'delivered', date: '2025-09-29T13:40:00', items: [{ bookId: 1, title: 'Le Petit Prince', quantity: 2, price: 12.99, language: 'Français' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1023, orderNumber: 'ORD-1023', customer: 'Zoé Roussel', customerEmail: 'zoe.roussel@email.fr', total: 52.99, status: 'pending', date: '2025-10-20T09:30:00', items: [{ bookId: 10, title: 'Educated', quantity: 1, price: 16.50, language: 'Anglais' }, { bookId: 9, title: 'The Alchemist', quantity: 1, price: 14.25, language: 'Anglais' }, { bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }] },
  { id: 1024, orderNumber: 'ORD-1024', customer: 'Adrien Bonnet', customerEmail: 'adrien.bonnet@email.fr', total: 31.49, status: 'shipped', date: '2025-09-28T16:20:00', items: [{ bookId: 7, title: 'The Great Gatsby', quantity: 1, price: 11.50, language: 'Anglais' }, { bookId: 8, title: 'Atomic Habits', quantity: 1, price: 19.99, language: 'Anglais' }] },
  { id: 1025, orderNumber: 'ORD-1025', customer: 'Brigitte Caron', customerEmail: 'brigitte.caron@email.fr', total: 44.99, status: 'delivered', date: '2025-09-27T12:00:00', items: [{ bookId: 3, title: 'Sapiens', quantity: 1, price: 22.00, language: 'Anglais' }, { bookId: 5, title: "L'Étranger", quantity: 1, price: 9.99, language: 'Français' }, { bookId: 1, title: 'Le Petit Prince', quantity: 1, price: 12.99, language: 'Français' }] },
];

let users = [
  { id: 1, name: 'Marie Dubois', email: 'marie.dubois@email.fr', role: 'USER', active: true, joinedDate: '2024-05-12', totalOrders: 12, totalSpent: 543.20 },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.fr', role: 'USER', active: true, joinedDate: '2024-03-20', totalOrders: 8, totalSpent: 324.50 },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.b@email.fr', role: 'USER', active: true, joinedDate: '2024-07-05', totalOrders: 15, totalSpent: 678.90 },
  { id: 4, name: 'Pierre Lefebvre', email: 'p.lefebvre@email.fr', role: 'USER', active: false, joinedDate: '2024-01-15', totalOrders: 3, totalSpent: 89.45 },
  { id: 5, name: 'Admin', email: 'admin@espritlivre.fr', role: 'ADMIN', active: true, joinedDate: '2023-11-01', totalOrders: 0, totalSpent: 0 },
  { id: 6, name: 'Claire Rousseau', email: 'claire.rousseau@email.fr', role: 'USER', active: true, joinedDate: '2024-08-22', totalOrders: 6, totalSpent: 234.10 },
  { id: 7, name: 'Lucas Moreau', email: 'lucas.m@email.fr', role: 'USER', active: true, joinedDate: '2024-02-14', totalOrders: 19, totalSpent: 892.35 },
  { id: 8, name: 'Emma Petit', email: 'emma.petit@email.fr', role: 'USER', active: true, joinedDate: '2024-06-30', totalOrders: 4, totalSpent: 156.78 },
  { id: 9, name: 'Antoine Leroy', email: 'antoine.leroy@email.fr', role: 'USER', active: true, joinedDate: '2024-04-18', totalOrders: 7, totalSpent: 412.30 },
  { id: 10, name: 'Camille Blanc', email: 'camille.blanc@email.fr', role: 'USER', active: true, joinedDate: '2024-09-05', totalOrders: 5, totalSpent: 298.75 },
  { id: 11, name: 'Alexandre Dupont', email: 'alex.dupont@email.fr', role: 'USER', active: true, joinedDate: '2024-01-22', totalOrders: 11, totalSpent: 623.50 },
  { id: 12, name: 'Isabelle Mercier', email: 'isabelle.m@email.fr', role: 'USER', active: false, joinedDate: '2024-06-11', totalOrders: 2, totalSpent: 67.48 },
  { id: 13, name: 'Julien Gauthier', email: 'julien.g@email.fr', role: 'USER', active: true, joinedDate: '2024-07-19', totalOrders: 9, totalSpent: 487.92 },
  { id: 14, name: 'Nathalie Vincent', email: 'nathalie.v@email.fr', role: 'USER', active: true, joinedDate: '2024-02-28', totalOrders: 14, totalSpent: 756.80 },
  { id: 15, name: 'Olivier Renard', email: 'olivier.renard@email.fr', role: 'USER', active: true, joinedDate: '2024-05-30', totalOrders: 6, totalSpent: 334.99 },
  { id: 16, name: 'Pauline Chevalier', email: 'pauline.c@email.fr', role: 'USER', active: false, joinedDate: '2024-08-14', totalOrders: 1, totalSpent: 41.49 },
  { id: 17, name: 'Quentin Marchand', email: 'quentin.m@email.fr', role: 'USER', active: true, joinedDate: '2024-03-07', totalOrders: 10, totalSpent: 512.20 },
  { id: 18, name: 'Rachel Lambert', email: 'rachel.lambert@email.fr', role: 'USER', active: true, joinedDate: '2024-04-25', totalOrders: 8, totalSpent: 445.36 },
];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to filter data by time range
const filterByTimeRange = (items, timeRange, dateField = 'date') => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return items.filter(item => {
    const itemDate = new Date(item[dateField]);

    switch(timeRange) {
      case 'Aujourd\'hui': {
        return itemDate >= today;
      }
      case 'Cette semaine': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate >= weekAgo;
      }
      case 'Ce mois-ci': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return itemDate >= monthStart;
      }
      default:
        return true;
    }
  });
};

// Helper function to calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return { value: 0, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change * 10) / 10), // Round to 1 decimal
    isPositive: change >= 0
  };
};

// Stats API with time range support
export const getStats = async (timeRange = 'Ce mois-ci') => {
  await delay();

  const filteredOrders = filterByTimeRange(orders, timeRange);
  const activeOrders = filteredOrders.filter(o => o.status !== 'cancelled');

  // Calculate current period stats
  const totalBooks = books.length;
  const totalUsers = users.filter(u => u.role === 'USER').length;
  const monthlySales = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = activeOrders.length;

  // Calculate previous period for comparison
  let previousPeriodOrders;
  const now = new Date();

  switch(timeRange) {
    case 'Aujourd\'hui': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      previousPeriodOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= yesterdayStart && orderDate < todayStart && o.status !== 'cancelled';
      });
      break;
    }
    case 'Cette semaine': {
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      previousPeriodOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo && o.status !== 'cancelled';
      });
      break;
    }
    case 'Ce mois-ci':
    default: {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      previousPeriodOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= lastMonthStart && orderDate <= lastMonthEnd && o.status !== 'cancelled';
      });
      break;
    }
  }

  // Calculate previous period totals
  const previousSales = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
  const previousOrders = previousPeriodOrders.length;

  // Mock growth for books and users (in real backend, this would be calculated from historical data)
  // Adding some variation including negative growth to demonstrate red/green states
  const booksGrowth = timeRange === 'Aujourd\'hui' ? { value: 1.2, isPositive: false } : // Show decrease for today
                      timeRange === 'Cette semaine' ? { value: 3.5, isPositive: true } :
                      { value: 12, isPositive: true };

  const usersGrowth = timeRange === 'Aujourd\'hui' ? { value: 2.1, isPositive: true } :
                      timeRange === 'Cette semaine' ? { value: 0.8, isPositive: false } : // Show decrease for this week
                      { value: 8, isPositive: true };

  return {
    totalBooks,
    totalUsers,
    monthlySales,
    totalOrders,
    growth: {
      books: booksGrowth,
      users: usersGrowth,
      sales: calculateGrowth(monthlySales, previousSales),
      orders: calculateGrowth(totalOrders, previousOrders)
    },
    timeRange
  };
};

export const getSalesChartData = async (timeRange = 'Ce mois-ci') => {
  await delay();

  // Generate chart data based on time range
  switch(timeRange) {
    case 'Aujourd\'hui': {
      // Hourly data for today
      return [
        { name: '6h', sales: 120 },
        { name: '9h', sales: 450 },
        { name: '12h', sales: 890 },
        { name: '15h', sales: 1200 },
        { name: '18h', sales: 980 },
        { name: '21h', sales: 560 },
        { name: '23h', sales: 320 },
      ];
    }
    case 'Cette semaine': {
      // Daily data for this week
      const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      return daysOfWeek.map(day => ({
        name: day,
        sales: Math.floor(Math.random() * 2000) + 1000 // Random data for demo
      }));
    }
    case 'Ce mois-ci':
    default: {
      // Weekly data for this month
      return [
        { name: 'Sem 1', sales: 4200 },
        { name: 'Sem 2', sales: 5900 },
        { name: 'Sem 3', sales: 4500 },
        { name: 'Sem 4', sales: 6200 },
      ];
    }
  }
};

// Books API
export const getBooks = async (page = 1, query = '', limit = 10) => {
  await delay();
  let filtered = [...books];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      b => b.title.toLowerCase().includes(q) ||
           b.author.toLowerCase().includes(q) ||
           b.category.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    data: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBookById = async (id) => {
  await delay();
  return books.find(b => b.id === id);
};

export const createBook = async (bookData) => {
  await delay(300);
  const newBook = {
    id: Math.max(...books.map(b => b.id)) + 1,
    ...bookData,
  };
  books.push(newBook);
  return newBook;
};

export const updateBook = async (id, bookData) => {
  await delay(300);
  const index = books.findIndex(b => b.id === id);
  if (index !== -1) {
    books[index] = { ...books[index], ...bookData };
    return books[index];
  }
  throw new Error('Book not found');
};

export const deleteBook = async (id) => {
  await delay(300);
  books = books.filter(b => b.id !== id);
  return { success: true };
};

// Orders API
export const getOrders = async (statusFilter = 'all', sortBy = 'date') => {
  await delay();
  let filtered = [...orders];

  if (statusFilter !== 'all') {
    filtered = filtered.filter(o => o.status === statusFilter);
  }

  if (sortBy === 'date') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'total') {
    filtered.sort((a, b) => b.total - a.total);
  }

  return filtered;
};

export const getOrderById = async (id) => {
  await delay();
  return orders.find(o => o.id === id);
};

export const updateOrderStatus = async (id, status) => {
  await delay(300);
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].status = status;
    return orders[index];
  }
  throw new Error('Order not found');
};

export const getRecentOrders = async (limit = 6) => {
  await delay();
  return [...orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// Users API
export const getUsers = async (query = '') => {
  await delay();
  // Filter out admins - only show e-commerce users
  let filtered = users.filter(u => u.role !== 'ADMIN');

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      u => u.name.toLowerCase().includes(q) ||
           u.email.toLowerCase().includes(q)
    );
  }

  return filtered;
};

export const getUserById = async (id) => {
  await delay();
  return users.find(u => u.id === id);
};

export const toggleUserActive = async (id) => {
  await delay(300);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index].active = !users[index].active;
    return users[index];
  }
  throw new Error('User not found');
};

export const updateUserRole = async (id, role) => {
  await delay(300);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index].role = role;
    return users[index];
  }
  throw new Error('User not found');
};
