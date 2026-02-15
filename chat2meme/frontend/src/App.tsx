import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import MainPage from './Pages/MainPageLayout';
import AuthPage from './Pages/AuthPage';
import ProtectedRoute from './Components/ProtectedRoute';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import DashboardVideo from './Pages/DashboardVideo';
import DashboardAudio from './Pages/DashboardAudio';
import ServiceVideo from './Pages/ServiceVideo';
import ServiceAudio from './Pages/ServiceAudio';
import Billing from './Pages/Billing';
import Settings from './Pages/Settings';
import ProfilePage from './Pages/ProfilePage';
import ServiceAvatar from './Pages/ServiceAvatar';
import CreateVideo from './Pages/CreateVideo';

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard/video",
        element: <DashboardVideo />,
      },
      {
        path: "dashboard/audio",
        element: <DashboardAudio />,
      },
      {
        path: "service/video",
        element: <ServiceVideo />,
      },
      {
        path: "service/video/create",
        element: <CreateVideo />,
      },
      {
        path: "service/audio",
        element: <ServiceAudio />,
      },
      {
        path: "service/avatar",
        element: <ServiceAvatar />,
      },
      {
        path: "billing",
        element: <Billing />,
      },
      {
        path: "setting",
        element: <Settings />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ]
  },
]);

function App() {
  useAuthBootstrap();
  return <RouterProvider router={router} />;
}

export default App;