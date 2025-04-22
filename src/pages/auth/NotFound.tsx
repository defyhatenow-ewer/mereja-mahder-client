import { Link, useRouteError } from "react-router-dom";
import { routes } from "../../routing";
import { HomeIcon } from "../../components/Icons";
import { useTranslation } from "react-i18next";

type CustomError = {
  statusText?: string;
  message?: string;
};

const NotFound = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  console.error(error);
  return (
    <div className="min-h-screen flex justify-center items-center bg-primary">
      <div className="flex flex-col items-center gap-5">
        <h1>Oops!</h1>
        <p>{t("unexpectedError")}</p>
        <p>
          <i>
            {(error as CustomError).statusText ||
              (error as CustomError).message}
          </i>
        </p>
        <Link
          to={routes.Home.absolute}
          className="flex gap-2 py-3 px-5 rounded-sm hover:bg-secondary hover:text-white"
        >
          <span>{t("goBack")}</span>
          <HomeIcon />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
