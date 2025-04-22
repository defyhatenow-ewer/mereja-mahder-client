import { useTranslation } from "react-i18next";

const Forbidden = () => {
  const { t } = useTranslation();
  return <div>{t("forbidden")}</div>;
};

export default Forbidden;
