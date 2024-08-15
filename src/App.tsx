import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import RootLayout from './pages/RootLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tickets, {loader as ticketsLoader} from './pages/Tickets';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/projects",
        element: <Projects />,
        // loader: searchCardLoader,
      },
      {
        path: "/projects/:projectId/tickets",
        element: <Tickets />,
        loader: ticketsLoader,
      },
    ],
    // errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
