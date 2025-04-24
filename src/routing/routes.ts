import { config } from "../config";

class Path {
  relative: string;
  absolute: string;
  constructor(relative: string, absolute?: string) {
    this.relative = relative;
    if (absolute) {
      this.absolute = absolute;
    } else if (relative === "/") {
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
  Home: new Path("/"),
  About: new Path("about"),
  ServerError: new Path("server-error"),
  Posts: new Path("posts"),
  SinglePost: new Path("posts/:id"),
  FactChecks: new Path("fact-checks"),
  SingleFactCheck: new Path("fact-checks/:id"),
  Reports: new Path("reports"),
  SingleReport: new Path("reports/:id"),
  Resources: new Path("resources"),
  SingleResource: new Path("resources/:id"),
  RadioShows: new Path("radio-shows"),
  SingleRadioShow: new Path("radio-shows/:id"),
  Auth: new Path("auth"),
  Login: new Path("login", "/auth/login"),
  Register: new Path("register", "/auth/register"),
  NotFound: new Path("not-found"),
  Forbidden: new Path("forbidden"),
  ForgotPassword: new Path("forgot-password", "/auth/forgot-password"),
  Profile: new Path("profile", "/dashboard/profile"),
  Settings: new Path(
    `${config.dashboardUrl}account`,
    `${config.dashboardUrl}account`
  ),
  ResetPassword: new Path("reset-password", "/auth/reset-password"),
  Dashboard: new Path("dashboard"),
  DashboardForbidden: new Path("forbidden", "/dashboard/forbidden"),
  Overview: new Path("overview", "/dashboard/overview"),
  Forum: new Path("forum", "/dashboard/forum"),
  SingleForum: new Path("forum/:id", "/dashboard/forum/:id"),
  Fellows: new Path("fellows", "/dashboard/fellows"),
  LearningResources: new Path(
    "learning-resources",
    "/dashboard/fellows/learning-resources"
  ),
  Partners: new Path("partners", "/dashboard/partners"),
  Data: new Path("data", "/dashboard/partners/data"),
  SingleChart: new Path("data/:id", "/dashboard/partners/data/:id"),
  SinglePrivatePost: new Path("single/:id", "/dashboard/posts/single/:id"),
  ReportList: new Path("reports", "/dashboard/partners/reports"),
  WomenSafeSpace: new Path("women-safe-space", "/dashboard/women-safe-space"),
  SafetyResources: new Path(
    "safety-resources",
    "/dashboard/women-safe-space/safety-resources"
  ),
  SinglePrivateReport: new Path(
    "reports/:id",
    "/dashboard/partners/reports/:id"
  ),
  SinglePrivateLearningResource: new Path(
    "learning-resources/:id",
    "/dashboard/fellows/learning-resources/:id"
  ),
  Materials: new Path("materials", "/dashboard/fellows/materials"),
  SinglePrivateMaterial: new Path(
    "materials/:id",
    "/dashboard/fellows/materials/:id"
  ),
  SinglePrivateSafetyResource: new Path(
    "safety-resources/:id",
    "/dashboard/women-safe-space/safety-resources/:id"
  ),
  SinglePrivateArticles: new Path(
    "articles/:id",
    "/dashboard/fellows/articles/:id"
  ),
};
