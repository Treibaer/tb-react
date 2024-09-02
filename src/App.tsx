import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Boards, { loader as boardsLoader } from "./pages/projects/BoardList";
import BoardDetails, {
  loader as boardDetailsLoader,
} from "./pages/projects/BoardView";
import ProjectDetailView, {
  loader as projectDetailsLoader,
} from "./pages/projects/ProjectDetailView";
import Projects, { loader as projectsLoader } from "./pages/projects/Projects";
import TicketDetailView, {
  loader as ticketDetailsLoader,
} from "./pages/projects/TicketDetailView";
import TicketList, {
  loader as ticketsAllLoader,
} from "./pages/projects/TicketList";
import TicketsBoardView, {
  loader as ticketsLoader,
} from "./pages/projects/TicketsBoardView";
import RootLayout from "./pages/RootLayout";
import Settings from "./pages/Settings";
import StatusView from "./pages/StatusView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/projects",
        element: <Projects />,
        loader: projectsLoader,
      },
      {
        path: "/projects/:projectSlug/tickets",
        element: <TicketsBoardView />,
        loader: ticketsLoader,
      },
      {
        path: "/projects/:projectSlug/boards",
        element: <Boards />,
        loader: boardsLoader,
      },
      {
        path: "/projects/:projectSlug/boards/:boardId",
        element: <BoardDetails />,
        loader: boardDetailsLoader,
      },
      {
        path: "/projects/:projectSlug/tickets/all",
        element: <TicketList />,
        loader: ticketsAllLoader,
      },
      {
        path: "/projects/:projectSlug/tickets/:ticketSlug",
        element: <TicketDetailView />,
        loader: ticketDetailsLoader,
      },
      {
        path: "/projects/:projectSlug",
        element: <ProjectDetailView />,
        loader: projectDetailsLoader,
      },
      {
        path: "/status",
        element: <StatusView />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
    // errorElement: <ErrorPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

function App() {
  return (
    <>
      {/* <Notifications /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
