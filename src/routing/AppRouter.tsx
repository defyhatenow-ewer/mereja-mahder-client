import { createBrowserRouter } from 'react-router-dom';
import routes from './routes';

// Layouts
import { Main, Dashboard, AuthLayout } from '../pages/layout';

// Main pages
import {
  About,
  FactChecks,
  Home,
  RadioShows,
  Reports,
  Resources,
  SingleChart,
  SingleFactCheck,
  // SingleForum,
  SinglePost,
  SinglePrivatePost,
  SingleRadioShow,
  SingleReport,
  SingleResource,
} from '../pages';

// Auth pages
import {
  Forbidden,
  ForgotPassword,
  ResetPassword,
  Login,
  Register,
  NotFound,
  Profile,
} from '../pages/auth';
// import { Forum } from "../pages/dashboard";
import {
  FellowsLayout,
  FellowsOverview,
  LearningResources,
  SinglePrivateLearningResource,
  SinglePrivateMaterial,
} from '../pages/fellows';
import {
  Data,
  CommunityOverview,
  CommunityLayout,
  ReportList,
  SinglePrivateReport,
} from '../pages/community';
import {
  SafetyResources,
  SinglePrivateSafetyResource,
  SinglePrivateWomenReport,
  WomenLayout,
  WomenOverview,
  WomenReport,
} from '../pages/womenSafeSpaces';
import ProtectedRoute from './ProtectedRoute';
import restrictions from './restrictions';
import Posts from '../pages/Posts';
import { Overview, Submit } from '../pages/dashboard';

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
            path: routes.SingleFactCheck.relative,
            element: <SingleFactCheck />,
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
            path: routes.SingleReport.relative,
            element: <SingleReport />,
          },
          {
            path: routes.Resources.relative,
            element: <Resources />,
          },
          {
            path: routes.SingleResource.relative,
            element: <SingleResource />,
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
            element: <Overview />,
          },
          {
            path: routes.Profile.relative,
            element: <Profile />,
          },
          {
            path: routes.DashboardForbidden.relative,
            element: <ProtectedRoute children={<Forbidden />} />,
          },
          {
            path: routes.Overview.relative,
            element: <Overview />,
          },
          {
            path: routes.Submit.relative,
            element: <Submit />,
          },
          // {
          //   path: routes.Forum.relative,
          //   element: (
          //     <ProtectedRoute
          //       children={<Forum />}
          //       restrictedTo={restrictions.none}
          //     />
          //   ),
          // },
          // {
          //   path: routes.SingleForum.relative,
          //   element: (
          //     <ProtectedRoute
          //       children={<SingleForum />}
          //       restrictedTo={restrictions.none}
          //     />
          //   ),
          // },
          {
            path: routes.SinglePrivatePost.relative,
            element: (
              <ProtectedRoute
                children={<SinglePrivatePost />}
                restrictedTo={restrictions.none}
              />
            ),
          },
          {
            path: routes.Fellows.relative,
            errorElement: <NotFound />,
            element: <FellowsLayout />,
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
              {
                path: routes.SinglePrivateLearningResource.relative,
                element: (
                  <ProtectedRoute
                    children={<SinglePrivateLearningResource />}
                    restrictedTo={restrictions.fellow}
                  />
                ),
              },
              {
                path: routes.SinglePrivateMaterial.relative,
                element: (
                  <ProtectedRoute
                    children={<SinglePrivateMaterial />}
                    restrictedTo={restrictions.fellow}
                  />
                ),
              },
            ],
          },
          {
            path: routes.Community.relative,
            errorElement: <NotFound />,
            element: <CommunityLayout />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute
                    children={<CommunityOverview />}
                    restrictedTo={restrictions.community}
                  />
                ),
              },
              {
                path: routes.Data.relative,
                element: (
                  <ProtectedRoute
                    children={<Data />}
                    restrictedTo={restrictions.communityAndCurator}
                  />
                ),
              },
              {
                path: routes.SingleChart.relative,
                element: (
                  <ProtectedRoute
                    children={<SingleChart />}
                    restrictedTo={restrictions.communityAndCurator}
                  />
                ),
              },
              {
                path: routes.ReportList.relative,
                element: (
                  <ProtectedRoute
                    children={<ReportList />}
                    restrictedTo={restrictions.community}
                  />
                ),
              },
              {
                path: routes.SinglePrivateReport.relative,
                element: (
                  <ProtectedRoute
                    children={<SinglePrivateReport />}
                    restrictedTo={restrictions.community}
                  />
                ),
              },
            ],
          },
          {
            path: routes.WomenSafeSpace.relative,
            errorElement: <NotFound />,
            element: <WomenLayout />,
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
              {
                path: routes.SinglePrivateSafetyResource.relative,
                element: (
                  <ProtectedRoute
                    children={<SinglePrivateSafetyResource />}
                    restrictedTo={restrictions.curator}
                  />
                ),
              },
              {
                path: routes.WomenReport.relative,
                element: (
                  <ProtectedRoute
                    children={<WomenReport />}
                    restrictedTo={restrictions.curator}
                  />
                ),
              },
              {
                path: routes.SinglePrivateWomenReport.relative,
                element: (
                  <ProtectedRoute
                    children={<SinglePrivateWomenReport />}
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
