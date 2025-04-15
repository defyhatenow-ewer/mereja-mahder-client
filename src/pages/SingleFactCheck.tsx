import { Link, useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../components";
import { formatDateTime } from "../utils";
import {
  FacebookButton,
  LinkedInButton,
  TwitterButton,
} from "../components/ShareButtons";
import { config } from "../config";
import { routes } from "../routing";
import { useGetSingleArticleQuery } from "../features/articles.api";

const buttonList = [FacebookButton, LinkedInButton, TwitterButton];

const SingleFactCheck = () => {
  const { id } = useParams();

  const { data: post, isLoading } = useGetSingleArticleQuery(
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
        No post found
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col justify-center bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-12">
      <section className="flex flex-col self-center items-center gap-5 w-full xl:w-4xl md:items-start md:gap-12 xl:gap-16">
        <div className="flex flex-col gap-3 w-full md:gap-5">
          <h2 className="text-2xl md:text-5xl">{post.title}</h2>
          <div className="flex gap-3 items-center flex-col md:flex-row md:gap-5">
            <small className="text-[#0B121580]">
              {formatDateTime(post.createdAt)}
            </small>
            <div className="flex gap-2 items-center">
              {(post.tags || []).map((tag) => (
                <Link
                  to={`${routes.FactChecks.absolute}?tag=${tag.title}`}
                  key={tag.id}
                  className="px-3 py-2 bg-primary rounded-2xl text-xs md:text-sm md:rounded-3xl md:px-4 md:py-1"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <RichTextReader data={post.content} />
        <div className="flex flex-col gap-2">
          <small>Share this post</small>
          <div className="flex gap-1">
            {buttonList.map((Btn, index) => (
              <Btn
                url={`${config.env.siteUrl}/posts/${id}`}
                title={post.title}
                withText={false}
                round={false}
                className="rounded-2xl"
                key={index}
                borderRadius={10}
              />
            ))}
          </div>
        </div>
        <hr className="w-full h-[1px] border-0 bg-[#D5D5D5]" />
      </section>
    </div>
  );
};

export default SingleFactCheck;
