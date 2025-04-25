import { useParams } from "react-router-dom";
import { Loader } from "../components";
import { useTranslation } from "react-i18next";
import { useGetSingleForumQuery } from "../features/forums.api";
import { useGetMessagesQuery } from "../features/messages.api";

const SingleForum = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: post, isLoading } = useGetSingleForumQuery(
    {
      id: id as string,
    },
    {
      skip: !id,
    }
  );

  const { data: messages } = useGetMessagesQuery(
    {
      query: {
        where: {
          forum: {
            equals: id,
          },
        },
      },
      options: {
        sort: "createdAt",
        limit: -1,
      },
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

  console.log(messages);

  return (
    <div className="flex flex-col bg-white gap-5 md:gap-12">
      <section className="flex flex-col border-1 border-[#D5D5D5] rounded-md md:rounded-2xl">
        <h2 className="bg-[#F3F3F3] p-5 border-b-1 border-[#D5D5D5] rounded-t-md text-sm md:px-8 md:text-lg md:rounded-t-2xl 2xl:px-12">
          {post.title}
        </h2>
        <div className="flex flex-col gap-5 p-5 rounded-b-md md:rounded-b-2xl md:p-8 md:gap-8 2xl:p-12 2xl:gap-12"></div>
      </section>
    </div>
  );
};

export default SingleForum;
