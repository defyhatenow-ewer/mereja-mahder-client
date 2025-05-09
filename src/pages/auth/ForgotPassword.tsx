import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth.api";
import { routes } from "../../routing";
import { toast } from "react-toastify";
import { ArrowUpRight } from "../../components/Icons";
import { translate } from "../../i18n";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (email === "") {
      toast.error(translate("pleaseAddMail"));
    } else {
      await forgotPassword({ email })
        .unwrap()
        .then(() => {
          setEmail("");
          toast.success(translate("checkEmail"));
        });
    }
  }

  return (
    <>
      <section className="flex flex-col justify-center items-center gap-5 w-full overflow-hidden">
        <form
          className="flex flex-col gap-3 w-full mb-0 text-[#202224] md:max-w-sm"
          onSubmit={handleForgotPassword}
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
          <button
            type="submit"
            aria-disabled={isLoading}
            className="flex justify-between items-center bg-primary hover:bg-secondary hover:text-primary cursor-pointer rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>{t("send")}</span>
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary inverse-child-icon">
                <ArrowUpRight />
              </div>
            )}
          </button>
          <p>
            {t("dontHaveAccount")}?{" "}
            <Link
              to={routes.Register.absolute}
              className="text-secondary font-poppins-semi-bold"
            >
              {t("getStarted")}
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default ForgotPassword;
