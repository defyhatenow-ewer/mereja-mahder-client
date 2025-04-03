import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../../features/auth.api";
import { Loader } from "../../components";
import { routes } from "../../routing";
import { toast } from "react-toastify";
import { ArrowUpRight } from "../../components/Icons";
import { goToDashboard } from "../../utils";

interface IdealLocationState {
  from: {
    pathname: string;
  };
}

type LocationState = IdealLocationState | null;

const Login = () => {
  localStorage.setItem("rememberMe", "false");
  const navigate = useNavigate();
  const location = useLocation();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const previousLocationState = location.state as LocationState;

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rememberMe = localStorage.getItem("rememberMe");

    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions first!");
    } else {
      await loginUser({ email, password })
        .unwrap()
        .then((payload) => {
          clearForm();
          if (rememberMe === "true") {
            localStorage.setItem("token", payload.token);
            localStorage.setItem("exp", payload.exp.toString());
            localStorage.setItem("userId", payload.user.id);
          } else {
            sessionStorage.setItem("token", payload.token);
            sessionStorage.setItem("exp", payload.exp.toString());
            sessionStorage.setItem("userId", payload.user.id);
          }
          navigate(
            previousLocationState?.from.pathname || goToDashboard(payload.user),
            {
              replace: true,
            }
          );
        });
    }
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
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Email"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-secondary mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    setAcceptTerms(true);
                  } else {
                    setAcceptTerms(false);
                  }
                }}
              />
              <span className="label-text text-[#202224] text-sm">
                I accept terms and conditions
              </span>
            </label>
          </div>
          <div className="flex justify-between items-center">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-secondary mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    localStorage.setItem("rememberMe", "true");
                  } else {
                    localStorage.setItem("rememberMe", "false");
                  }
                }}
              />
              <span className="label-text text-black text-sm">Remember me</span>
            </label>
            <Link
              to={routes.ForgotPassword.absolute}
              className="text-secondary text-sm font-poppins-semi-bold"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            aria-disabled={isLoading}
            className="flex justify-between items-center bg-primary cursor-pointer rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>Login</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary">
              <ArrowUpRight />
            </div>
          </button>
          <p>
            You don&apos;t have an account?{" "}
            <Link
              to={routes.Register.absolute}
              className="text-black font-poppins-semi-bold"
            >
              Register
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
