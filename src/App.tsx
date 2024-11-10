import { Provider } from "react-redux";
import {
  createBrowserRouter,
  NavLink,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import "./App.css";
import Button from "./components/Button";
import AssetDetailView, {
  loader as assetDetailsLoader,
} from "./pages/AssetDetails";
import Assets, { loader as assetsLoader } from "./pages/Assets";
import Changelog, {
  loader as changelogLoader
} from "./pages/Changelog";
import Dashboard from "./pages/Dashboard";
import FinanceDashboard, {
  loader as financeDashboardLoader,
} from "./pages/finances/FinanceDashboard";
import FinanceDetailView, {
  loader as detailViewLoader,
} from "./pages/finances/FinanceDetailView";
import FinanceSummaryView, {
  loader as summaryViewLoader,
} from "./pages/finances/FinanceSummaryView";
import Logout from "./pages/Logout";
import Boards, { loader as boardsLoader } from "./pages/projects/BoardList";
import BoardDetails, {
  loader as boardDetailsLoader,
} from "./pages/projects/BoardView";
import PageDetailView, {
  loader as pageDetailsLoader,
} from "./pages/projects/PageDetailView";
import Pages, { loader as pagesLoader } from "./pages/projects/Pages";
import PasswordEntries, {
  loader as passwordEntriesLoader,
} from "./pages/projects/PasswordEntries";
import Passwords, {
  loader as passwordsLoader,
} from "./pages/projects/Passwords";
import ProjectDetailView, {
  loader as projectDetailsLoader,
} from "./pages/projects/ProjectDetailView";
import Projects, { loader as projectsLoader } from "./pages/projects/Projects";
import TicketDetailView, {
  loader as ticketDetailsLoader,
} from "./pages/projects/TicketDetailView";
import TicketHistoryView, {
  loader as ticketDetailsHistoryLoader,
} from "./pages/projects/TicketHistoryView";
import TicketList, {
  loader as ticketsAllLoader,
} from "./pages/projects/TicketList";
import BoardStructureView, {
  loader as ticketsLoader,
} from "./pages/projects/BoardStructureView";
import Register from "./pages/Register";
import RootLayout from "./pages/RootLayout";
import Settings from "./pages/Settings";
import StatusView from "./pages/StatusView";
import { AppContextProvider } from "./store/AppContext";
import { store } from "./store/store";
import { ToastProvider } from "./store/ToastContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppContextProvider>
        <ToastProvider>
          <RootLayout />
        </ToastProvider>
      </AppContextProvider>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/projects",
        element: <Projects />,
        loader: projectsLoader,
      },
      {
        path: "/projects/:projectSlug/tickets",
        element: <BoardStructureView />,
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
        loader: financeDashboardLoader,
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
        path: "/passwords",
        element: <Passwords />,
        loader: passwordsLoader,
      },
      {
        path: "/passwords/:environmentId/entries",
        element: <PasswordEntries />,
        loader: passwordEntriesLoader,
      },
      {
        path: "/status",
        element: <StatusView />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/assets",
        element: <Assets />,
        loader: assetsLoader,
      },
      {
        path: "/assets/:assetId",
        element: <AssetDetailView />,
        loader: assetDetailsLoader,
      },
      {
        path: "/changelog",
        element: <Changelog />,
        loader: changelogLoader,
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
    <Provider store={store}>
      {/* <Notifications /> */}
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;

function ErrorBoundary() {
  const error = useRouteError() as any;
  if (error.status === 401 || error.status === 403) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.message || "Something went wrong!"}</p>
        <p>
          <NavLink to={"/"}>
            <Button title="Go to Dashboard" />
          </NavLink>
        </p>
      </div>
    );
  }
  // Fallback UI for unexpected errors
  console.log(error.data);
  return <div>Something went wrong!</div>;
}
