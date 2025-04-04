import { createBrowserRouter } from "react-router-dom";
import routes from "./routes";

// Layouts
import { Main, Dashboard, AuthLayout } from "../pages/layout";

// Main pages
import {
  About,
  FactChecks,
  Home,
  RadioShows,
  Reports,
  Resources,
  SinglePost,
  SingleRadioShow,
} from "../pages";

// Auth pages
import {
  Forbidden,
  ForgotPassword,
  ResetPassword,
  Profile,
  Login,
  Register,
  NotFound,
} from "../pages/auth";
import { Forum, Overview } from "../pages/dashboard";
import { FellowsOverview, LearningResources } from "../pages/fellows";
import { Data, PartnerOverview, ReportList } from "../pages/partners";
import { SafetyResources, WomenOverview } from "../pages/womenSafeSpaces";
import ProtectedRoute from "./ProtectedRoute";
import restrictions from "./restrictions";
import Posts from "../pages/Posts";

const AppRouter = createBrowserRouter([
  {
    path: routes.Home.relative,
    element: <Main />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: routes.About.relative,
            element: <About />,
          },
          {
            path: routes.Forbidden.relative,
            element: <Forbidden />,
          },
          {
            path: routes.Posts.relative,
            element: <Posts />,
          },
          {
            path: routes.SinglePost.relative,
            element: <SinglePost />,
          },
          {
            path: routes.FactChecks.relative,
            element: <FactChecks />,
          },
          {
            path: routes.RadioShows.relative,
            element: <RadioShows />,
          },
          {
            path: routes.SingleRadioShow.relative,
            element: <SingleRadioShow />,
          },
          {
            path: routes.Reports.relative,
            element: <Reports />,
          },
          {
            path: routes.Resources.relative,
            element: <Resources />,
          },
        ],
      },
    ],
  },
  {
    path: routes.Auth.relative,
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: routes.ForgotPassword.relative,
            element: <ForgotPassword />,
          },
          {
            path: routes.ResetPassword.relative,
            element: <ResetPassword />,
          },
          {
            path: routes.Login.relative,
            element: <Login />,
          },
          {
            path: routes.Register.relative,
            element: <Register />,
          },
        ],
      },
    ],
  },
  {
    path: routes.Dashboard.relative,
    element: <Dashboard />,
    children: [
      {
        errorElement: <NotFound />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute
                children={<Overview />}
                restrictedTo={restrictions.admin}
              />
            ),
          },
          {
            path: routes.Profile.relative,
            element: (
              <ProtectedRoute
                children={<Profile />}
                restrictedTo={restrictions.none}
              />
            ),
          },
          {
            path: routes.DashboardForbidden.relative,
            element: <ProtectedRoute children={<Forbidden />} />,
          },
          {
            path: routes.Overview.relative,
            element: (
              <ProtectedRoute
                children={<Overview />}
                restrictedTo={restrictions.admin}
              />
            ),
          },
          {
            path: routes.Forum.relative,
            element: (
              <ProtectedRoute
                children={<Forum />}
                restrictedTo={restrictions.none}
              />
            ),
          },
          {
            path: routes.Fellows.relative,
            errorElement: <NotFound />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute
                    children={<FellowsOverview />}
                    restrictedTo={restrictions.fellow}
                  />
                ),
              },
              {
                path: routes.LearningResources.relative,
                element: (
                  <ProtectedRoute
                    children={<LearningResources />}
                    restrictedTo={restrictions.fellow}
                  />
                ),
              },
            ],
          },
          {
            path: routes.Partners.relative,
            errorElement: <NotFound />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute
                    children={<PartnerOverview />}
                    restrictedTo={restrictions.partner}
                  />
                ),
              },
              {
                path: routes.Data.relative,
                element: (
                  <ProtectedRoute
                    children={<Data />}
                    restrictedTo={restrictions.partnerAndCurator}
                  />
                ),
              },
              {
                path: routes.ReportList.relative,
                element: (
                  <ProtectedRoute
                    children={<ReportList />}
                    restrictedTo={restrictions.partnerAndCurator}
                  />
                ),
              },
            ],
          },
          {
            path: routes.WomenSafeSpace.relative,
            errorElement: <NotFound />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute
                    children={<WomenOverview />}
                    restrictedTo={restrictions.curator}
                  />
                ),
              },
              {
                path: routes.SafetyResources.relative,
                element: (
                  <ProtectedRoute
                    children={<SafetyResources />}
                    restrictedTo={restrictions.curator}
                  />
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default AppRouter;
