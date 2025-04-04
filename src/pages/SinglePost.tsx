import { useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../components";
import { useGetSinglePostQuery } from "../features/posts.api";
import { formatDateTime } from "../utils";
import {
  FacebookButton,
  LinkedInButton,
  TwitterButton,
} from "../components/ShareButtons";
import { config } from "../config";

const buttonList = [FacebookButton, LinkedInButton, TwitterButton];

const SinglePost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetSinglePostQuery(
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
      <section className="flex flex-col self-center gap-5 w-full xl:w-4xl md:gap-12 xl:gap-16">
        <div className="flex flex-col gap-3 w-full md:gap-5">
          <h2>{post.title}</h2>
          <div className="flex gap-3 items-center md:gap-5">
            <small className="text-[#0B121580]">
              {formatDateTime(post.createdAt)}
            </small>
            <div className="flex gap-5 items-center">
              {["FactCheck", "News"].map((tag, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-primary rounded-2xl md:rounded-3xl md:px-4 md:py-1"
                >
                  {tag}
                </div>
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

export default SinglePost;
