import { useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../../components";
import { formatDateTime } from "../../utils";
import { useGetMaterialsQuery } from "../../features/materials.api";
import { useTranslation } from "react-i18next";

const SinglePrivateMaterial = () => {
  const { slug } = useParams();
  const { t } = useTranslation();

  const { data: post, isLoading } = useGetMaterialsQuery(
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
    <div className="flex flex-col bg-white gap-5 md:gap-8">
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
      </div>
    </div>
  );
};

export default SinglePrivateMaterial;
