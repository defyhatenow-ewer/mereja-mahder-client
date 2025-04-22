import { useTranslation } from "react-i18next";

const DashboardFooter = () => {
  const { t } = useTranslation();
  return (
    <div className="border-t-1 border-[#C0C0C0] border-0 py-5 flex flex-col gap-3 justify-between items-center md:w-full md:flex-row md:py-5">
      <div className="flex flex-col gap-5 md:flex-row md:gap-12">
        <small className="">
          © {new Date().getFullYear()} {t("copyright")}
        </small>
        <small className="hidden md:inline">{t("legalNotice")}</small>
      </div>
      <small className="hidden md:inline">CC-BY-SA 4.0 Meraja Mahder</small>
    </div>
  );
};

export default DashboardFooter;
