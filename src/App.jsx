import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Profile from './pages/profile'; // Profile Page
import Friend from './pages/Friends';
import FriendProf from './pages/FriendProf'; // Import FriendProf Page
import Feed from './pages/feed'; // Import Feed Page
import ForgetPassword from './pages/ForgetPassword'; // Import ForgetPassword Page
import VerifyOtp from './pages/VerifyOtp'; // Import VerifyOtp Page

// Components
import Navbar from './components/Navbar';
import Leftbar from './components/Leftbar';
import Rightbar from './components/Rightbar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const { currentUser } = useContext(AuthContext);
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}>
              <Leftbar />
            </div>
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <div style={{ flex: 2 }}>
              <Rightbar />
            </div>
          </div>
        </QueryClientProvider>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (currentUser === null) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/profile/:userId', // Profile page route with userId as param
          element: <Profile />,
        },
        {
          path: '/friends',
          element: <Friend />,
        },
        {
          path: '/friendprof', // FriendProf page
          element: <FriendProf />,
        },
        {
          path: '/feed', // New feed route
          element: <Feed />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    // Forget Password Route
    {
      path: '/forget-password',
      element: <ForgetPassword />, // Forgot Password page
    },
    // Verify OTP Route
    {
      path: '/verify-otp',
      element: <VerifyOtp />, // OTP Verification page
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
