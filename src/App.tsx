import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tickets, { loader as ticketsLoader } from "./pages/Tickets";
import ProjectDetails, {
  loader as projectDetailsLoader,
} from "./pages/ProjectDetails";
import TicketDetails, {
  loader as ticketDetailsLoader,
} from "./pages/TicketDetails";

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
        path: "/projects/:projectSlug/tickets",
        element: <Tickets />,
        loader: ticketsLoader,
      },
      {
        path: "/projects/:projectSlug/tickets/:ticketId",
        element: <TicketDetails />,
        loader: ticketDetailsLoader,
      },
      {
        path: "/projects/:projectSlug",
        element: <ProjectDetails />,
        loader: projectDetailsLoader,
      },
    ],
    // errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
