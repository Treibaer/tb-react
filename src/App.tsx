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
import TicketHistoryView, {
  loader as ticketDetailsHistoryLoader,
} from "./pages/projects/TicketHistoryView";
import Register from "./pages/Register";
import FinanceDashboard from "./pages/finances/FinanceDashboard";
import FinanceDetailView, {
  loader as detailViewLoader,
} from "./pages/finances/FinanceDetailView";
import FinanceSummaryView, {
  loader as summaryViewLoader,
} from "./pages/finances/FinanceSummaryView";
import Pages, { loader as pagesLoader } from "./pages/projects/Pages";
import PageDetailView, {
  loader as pageDetailsLoader,
} from "./pages/projects/PageDetailView";

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
        path: "/projects/:projectSlug/tickets/:ticketSlug/history",
        element: <TicketHistoryView />,
        loader: ticketDetailsHistoryLoader,
      },
      {
        path: "/projects/:projectSlug",
        element: <ProjectDetailView />,
        loader: projectDetailsLoader,
      },
      {
        path: "/projects/:projectSlug/pages",
        element: <Pages />,
        loader: pagesLoader,
      },
      {
        path: "/projects/:projectSlug/pages/:pageId",
        element: <PageDetailView />,
        loader: pageDetailsLoader,
      },
      {
        path: "/finances",
        element: <FinanceDashboard />,
      },
      {
        path: "/finances/details",
        element: <FinanceDetailView />,
        loader: detailViewLoader,
      },
      {
        path: "/finances/summary",
        element: <FinanceSummaryView />,
        loader: summaryViewLoader,
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
  {
    path: "/register",
    element: <Register />,
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
