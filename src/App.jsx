import { AuthProvider } from './contexts/AuthContext';
import AdminRoutes from './router/AdminRoutes';

function App() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}

export default App;
