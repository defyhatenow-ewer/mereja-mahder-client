import { useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../../components";
import { formatDateTime } from "../../utils";
import { useTranslation } from "react-i18next";
import { config } from "../../config";
import { useGetLearningResourcesQuery } from "../../features/learningResources.api";

const SinglePrivateLearningResource = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { data: post, isLoading } = useGetLearningResourcesQuery(
    {
      query: {
        where: {
          slug: {
            equals: slug,
          },
        },
      },
    },
    {
      skip: !slug,
    }
  );

  if (isLoading) return <Loader />;

  if (!isLoading && (!post || !post.docs.length))
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        {t("postNotFound")}
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col bg-white gap-5 md:gap-12">
      <section className="flex flex-col gap-3 md:gap-5">
        <h2>{post.docs[0].title}</h2>
        <div className="flex gap-3 items-center flex-col md:flex-row md:gap-5">
          <small className="text-[#0B121580]">
            {formatDateTime(post.docs[0].updatedAt)}
          </small>
        </div>
      </section>
      <div className="flex flex-col gap-5 w-full items-center md:items-start md:gap-12">
        <RichTextReader data={post.docs[0].content} />
        {post.docs[0].pdf && (
          <iframe
            src={
              typeof post.docs[0].pdf === "string"
                ? `${config.env.apiKey}${post.docs[0].pdf}`
                : `${config.env.apiKey}${post.docs[0].pdf.url}`
            }
            className="w-full h-screen self-center"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default SinglePrivateLearningResource;
