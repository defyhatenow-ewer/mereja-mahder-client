import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "../../components";
import { useResetPasswordMutation } from "../../features/auth.api";
import { routes } from "../../routing";
import { ArrowUpRight } from "../../components/Icons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [password, setPassword] = useState("");

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (password === "") {
      toast.error("Please add a new password");
    } else if (!token) {
      toast.error("Please login");
    } else {
      await resetPassword({
        password,
        token,
      })
        .unwrap()
        .then(() => {
          setPassword("");
          navigate(routes.Login.absolute);
          toast.success(
            "Your change was successful. Try signing in with the new password"
          );
        });
    }
  }

  return (
    <>
      <Loader show={isLoading} />

      <section className="flex flex-col justify-center items-center gap-5 w-full overflow-hidden">
        <form
          className="flex flex-col gap-3 w-full mb-0 text-[#202224] md:max-w-sm"
          onSubmit={handleResetPassword}
        >
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
          <button
            type="submit"
            aria-disabled={isLoading}
            className="flex justify-between items-center bg-primary cursor-pointer rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>Send</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary">
              <ArrowUpRight />
            </div>
          </button>
          <p>
            Remembered your password?{" "}
            <Link
              to={routes.Login.absolute}
              className="text-secondary font-poppins-semi-bold"
            >
              Login
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default ResetPassword;
