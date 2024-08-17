import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import ProjectDetails, {
  loader as projectDetailsLoader,
} from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import RootLayout from "./pages/RootLayout";
import TicketDetails, {
  loader as ticketDetailsLoader,
} from "./pages/TicketDetails";
import Tickets, { loader as ticketsLoader } from "./pages/Tickets";
import TicketsAll, { loader as ticketsAllLoader } from "./pages/TicketsAll";

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
        path: "/projects/:projectSlug/tickets/all",
        element: <TicketsAll />,
        loader: ticketsAllLoader,
      },
      {
        path: "/projects/:projectSlug/tickets/:ticketSlug",
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
