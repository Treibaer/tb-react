import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Boards, { loader as boardsLoader } from "./pages/projects/Boards";
import BoardDetails, {
  loader as boardDetailsLoader,
} from "./pages/projects/BoardView";
import ProjectDetails, {
  loader as projectDetailsLoader,
} from "./pages/projects/ProjectDetails";
import Projects, { loader as projectsLoader } from "./pages/projects/Projects";
import TicketDetailView, {
  loader as ticketDetailsLoader,
} from "./pages/projects/TicketDetailView";
import TicketsBoardView, {
  loader as ticketsLoader,
} from "./pages/projects/TicketsBoardView";
import TicketsList, {
  loader as ticketsAllLoader,
} from "./pages/projects/TicketsList";
import RootLayout from "./pages/RootLayout";
import { Notifications } from "./notifications";

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
        element: <TicketsList />,
        loader: ticketsAllLoader,
      },
      {
        path: "/projects/:projectSlug/tickets/:ticketSlug",
        element: <TicketDetailView />,
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
  return (
    <>
      {/* <Notifications /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
