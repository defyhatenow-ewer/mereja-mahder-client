import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth.api";
import { Loader } from "../../components";
import { routes } from "../../routing";
import { useGetSpacesQuery } from "../../features/space.api";
import { toast } from "react-toastify";
import { ArrowUpRight } from "../../components/Icons";
import { translate } from "../../i18n";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  localStorage.setItem("rememberMe", "false");
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { data, isLoading: isSpacesLoading } = useGetSpacesQuery({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [space, setSpace] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const getSpaceName = async (_space: string): Promise<string> => {
    switch (_space) {
      case "aff":
        return translate("affFellow");
      case "partners":
        return translate("partner");
      case "women_safe_space":
        return translate("womenSafeSpaces");

      default:
        return _space;
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rememberMe = localStorage.getItem("rememberMe");

    if (!space) {
      toast.error(translate("selectSpace"));
    } else if (!acceptTerms) {
      toast.error(translate("acceptT&C"));
    } else {
      await registerUser({ name, email, password })
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
          navigate("/");
        });
    }
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <Loader show={isLoading || isSpacesLoading} />
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
            <label>{t("username")}</label>
            <input
              type="text"
              placeholder="Name"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setName(e.target.value)}
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
          <div className="flex flex-col gap-2">
            <p className="font-poppins-medium">{t("chooseSpace")}</p>
            <div className="flex flex-wrap justify-between items-center">
              {data.docs.map((space) => (
                <label key={space.id} className="label cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-xs radio-secondary mr-2"
                    name="spaces"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onChange={(_e) => setSpace(space.id)}
                  />
                  <span className="label-text text-black text-sm">
                    {getSpaceName(space.title)}
                  </span>
                </label>
              ))}
            </div>
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
                {t("IAcceptT&C")}
              </span>
            </label>
          </div>
          <div className="flex flex-wrap justify-between items-center">
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
              <span className="label-text text-black text-sm">
                {t("rememberMe")}
              </span>
            </label>
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
            className="flex cursor-pointer justify-between items-center bg-primary rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>{t("register")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary">
              <ArrowUpRight />
            </div>
          </button>
          <p className="text-sm text-secondary font-normal">
            {t("doHaveAccount")}?{" "}
            <Link
              to={routes.Login.absolute}
              className="text-black font-poppins-semi-bold"
            >
              {t("login")}
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Register;
