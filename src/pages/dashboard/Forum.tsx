import { useTranslation } from "react-i18next";
import { useGetForumsQuery } from "../../features/forums.api";
import { config } from "../../config";
import { Link } from "react-router-dom";
import { routes } from "../../routing";
import { ArrowUpRight, Edit } from "../../components/Icons";

const Forum = () => {
  const { t } = useTranslation();
  const { data: forums, isLoading } = useGetForumsQuery({});

  if (isLoading) {
    return <p>{`${t("loading")}...`}</p>;
  }

  return (
    <div className="flex flex-col border-1 border-[#D5D5D5] rounded-md md:rounded-2xl">
      <div className="flex items-center justify-between bg-[#F3F3F3] p-5 border-b-1 border-[#D5D5D5] rounded-t-md md:px-5 md:rounded-t-2xl 2xl:px-12">
        <h2>{t("forums")}</h2>
        <a
          href={`${config.dashboardUrl}collections/forums/create`}
          target="_blank"
          className="flex justify-between items-center gap-3 bg-secondary text-primary hover:text-white cursor-pointer rounded-4xl p-2 ps-3 w-fit md:w-fit md:ps-5"
        >
          <span>{t("addNew")}</span>
          <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
            <ArrowUpRight className="size-3" />
          </div>
        </a>
      </div>
      {forums && forums.docs.length ? (
        forums.docs.map((forum) => (
          <div
            key={forum.id}
            className="flex flex-col gap-3 p-5 rounded-md shadow-lg md:gap-5 md:rounded-2xl"
          >
            <Link to={`${routes.Forum.absolute}/${forum.slug}`}>
              <h3 className="text-left hover:text-light-red">{forum.title}</h3>
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={`${config.dashboardUrl}collections/forums/${forum.id}`}
                target="_blank"
                className="flex gap-2 items-center cursor-pointer bg-primary hover:bg-secondary hover:text-primary py-1 px-2 rounded-md text-xs"
              >
                <Edit className="size-3" />
                <span>Edit</span>
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>
          {t("noForumsFound")}{" "}
          <a
            href={`${config.dashboardUrl}collections/forums/create`}
            target="_blank"
            className="font-poppins-semi-bold hover:text-light-red"
          >
            {t("here")}
          </a>
        </p>
      )}
    </div>
  );
};

export default Forum;
