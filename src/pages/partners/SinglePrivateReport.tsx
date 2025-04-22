import { useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../../components";
import { formatDateTime, makeDownloadable } from "../../utils";
import { useGetSingleReportQuery } from "../../features/reports.api";
import { ArrowDown } from "../../components/Icons";
import { useTranslation } from "react-i18next";

const SinglePrivateReport = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: post, isLoading } = useGetSingleReportQuery(
    {
      id: id as string,
    },
    {
      skip: !id,
    }
  );

  if (isLoading) return <Loader />;

  if (!isLoading && !post)
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        {t("postNotFound")}
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col bg-white gap-5 md:gap-12">
      <section className="flex flex-col gap-3 md:gap-5">
        <h2>{post.title}</h2>
        <div className="flex gap-3 items-center flex-col md:flex-row md:gap-5">
          <small className="text-[#0B121580]">
            {formatDateTime(post.updatedAt)}
          </small>
        </div>
      </section>
      <div className="flex flex-col gap-5 w-full items-center md:items-start md:gap-12">
        <RichTextReader data={post.content} />
        {typeof post.pdf === "string" && (
          <a
            download
            href={makeDownloadable(post.pdf)}
            className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-2xl p-3 w-full text-sm md:text-base md:w-md"
          >
            <span>{t("download")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ArrowDown />
            </div>
          </a>
        )}
        {post.pdf && typeof post.pdf !== "string" && (
          <a
            download
            href={makeDownloadable(post.pdf.url as string)}
            className="flex justify-between items-center gap-3 bg-secondary text-white cursor-pointer rounded-2xl p-3 w-full text-sm md:text-base md:w-md"
          >
            <span>{t("download")}</span>
            <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
              <ArrowDown />
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default SinglePrivateReport;
