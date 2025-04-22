import { useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../../components";
import { formatDateTime } from "../../utils";
import { useGetSingleResourceQuery } from "../../features/resources.api";
import { useTranslation } from "react-i18next";

const SinglePrivateSafetyResource = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: post, isLoading } = useGetSingleResourceQuery(
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
      </div>
    </div>
  );
};

export default SinglePrivateSafetyResource;
