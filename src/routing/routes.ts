import { config } from '../config';

class Path {
  relative: string;
  absolute: string;
  constructor(relative: string, absolute?: string) {
    this.relative = relative;
    if (absolute) {
      this.absolute = absolute;
    } else if (relative === '/') {
      this.absolute = relative;
    } else {
      this.absolute = `/${relative}`;
    }
  }

  valueOf() {
    return this.absolute;
  }

  toString() {
    return this.absolute;
  }
}

export default {
  Home: new Path('/'),
  About: new Path('about'),
  ServerError: new Path('server-error'),
  Posts: new Path('posts'),
  SinglePost: new Path('posts/:slug'),
  FactChecks: new Path('fact-checks'),
  SingleFactCheck: new Path('fact-checks/:slug'),
  Reports: new Path('reports'),
  SingleReport: new Path('reports/:slug'),
  Resources: new Path('resources'),
  SingleResource: new Path('resources/:slug'),
  RadioShows: new Path('radio-shows'),
  SingleRadioShow: new Path('radio-shows/:slug'),
  Auth: new Path('auth'),
  Login: new Path('login', '/auth/login'),
  Register: new Path('register', '/auth/register'),
  NotFound: new Path('not-found'),
  Forbidden: new Path('forbidden'),
  ForgotPassword: new Path('forgot-password', '/auth/forgot-password'),
  Profile: new Path('profile', '/dashboard/profile'),
  Settings: new Path(
    `${config.dashboardUrl}account?hide=true`,
    `${config.dashboardUrl}account?hide=true`
  ),
  SubmitArticle: new Path(
    `${config.dashboardUrl}collections/articles/create`,
    `${config.dashboardUrl}collections/articles/create`
  ),
  ResetPassword: new Path('reset-password', '/auth/reset-password'),
  Dashboard: new Path('dashboard'),
  DashboardForbidden: new Path('forbidden', '/dashboard/forbidden'),
  Overview: new Path('overview', '/dashboard/overview'),
  Submit: new Path('submit', '/dashboard/submit'),
  Forum: new Path(
    'https://forum.merejamahder.net/',
    'https://forum.merejamahder.net/'
  ),
  SingleForum: new Path('forum/:slug', '/dashboard/forum/:slug'),
  Fellows: new Path('fellows', '/dashboard/fellows'),
  LearningResources: new Path(
    'learning-resources',
    '/dashboard/fellows/learning-resources'
  ),
  Community: new Path('community', '/dashboard/community'),
  Data: new Path('data', '/dashboard/community/data'),
  SingleChart: new Path('data/:slug', '/dashboard/community/data/:slug'),
  SinglePrivatePost: new Path('single/:slug', '/dashboard/posts/single/:slug'),
  ReportList: new Path('reports', '/dashboard/community/reports'),
  WomenSafeSpace: new Path('women-safe-space', '/dashboard/women-safe-space'),
  WomenReport: new Path('reports', '/dashboard/women-safe-space/reports'),
  SinglePrivateWomenReport: new Path(
    'reports/:slug',
    '/dashboard/women-safe-space/reports/:slug'
  ),
  SafetyResources: new Path(
    'safety-resources',
    '/dashboard/women-safe-space/safety-resources'
  ),
  SinglePrivateReport: new Path(
    'reports/:slug',
    '/dashboard/community/reports/:slug'
  ),
  SinglePrivateLearningResource: new Path(
    'learning-resources/:slug',
    '/dashboard/fellows/learning-resources/:slug'
  ),
  Materials: new Path('materials', '/dashboard/fellows/materials'),
  SinglePrivateMaterial: new Path(
    'materials/:slug',
    '/dashboard/fellows/materials/:slug'
  ),
  SinglePrivateSafetyResource: new Path(
    'safety-resources/:slug',
    '/dashboard/women-safe-space/safety-resources/:slug'
  ),
  SinglePrivateArticles: new Path(
    'articles/:slug',
    '/dashboard/fellows/articles/:slug'
  ),
};
