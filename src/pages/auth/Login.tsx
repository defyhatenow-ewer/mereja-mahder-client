import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../features/auth.api";
import { Loader } from "../../components";
import { routes } from "../../routing";
import { ArrowUpRight } from "../../components/Icons";
import { goToDashboard } from "../../utils";
import { useTranslation } from "react-i18next";

interface IdealLocationState {
  from: {
    pathname: string;
  };
}

type LocationState = IdealLocationState | null;

const Login = () => {
  const { t } = useTranslation();
  localStorage.setItem("rememberMe", "false");
  const navigate = useNavigate();
  const location = useLocation();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const previousLocationState = location.state as LocationState;

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await loginUser({ email, password })
      .unwrap()
      .then((payload) => {
        clearForm();
        localStorage.setItem("token", payload.token);
        localStorage.setItem("exp", payload.exp.toString());
        localStorage.setItem("userId", payload.user.id);
        navigate(
          previousLocationState?.from.pathname || goToDashboard(payload.user),
          {
            replace: true,
          }
        );
      });
  }

  return (
    <>
      <Loader show={isLoading} />
      <section className="flex flex-col justify-center items-center gap-5 w-full overflow-hidden md:gap-8">
        <form
          className="flex flex-col gap-3 w-full mb-0 text-[#202224] md:max-w-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label>{t("emailAddress")}</label>
            <input
              type="email"
              placeholder="Email"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>{t("password")}</label>
            <input
              type="password"
              placeholder="Password"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-wrap justify-between items-center">
            <Link
              to={routes.ForgotPassword.absolute}
              className="text-secondary text-sm font-poppins-semi-bold"
            >
              {t("forgotPassword")}?
            </Link>
          </div>
          <button
            type="submit"
            aria-disabled={isLoading}
            className="flex justify-between items-center bg-primary hover:bg-secondary hover:text-primary cursor-pointer rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>{t("login")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary inverse-child-icon">
              <ArrowUpRight />
            </div>
          </button>
          <p>
            {t("dontHaveAccount")}?{" "}
            <Link
              to={routes.Register.absolute}
              className="text-black font-poppins-semi-bold"
            >
              {t("register")}
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
