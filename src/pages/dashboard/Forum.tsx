import { useTranslation } from "react-i18next";

const Forum = () => {
  const { t } = useTranslation();
  return <div>{t("forums")}</div>;
};

export default Forum;
