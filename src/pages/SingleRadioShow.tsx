import { Link, useParams } from "react-router-dom";
import { Loader, RichTextReader } from "../components";
import { useGetPostsQuery, useGetSinglePostQuery } from "../features/posts.api";
import { formatDateTime } from "../utils";
import {
  FacebookButton,
  LinkedInButton,
  TwitterButton,
} from "../components/ShareButtons";
import { config } from "../config";
import { ArrowUpRight } from "../components/Icons";
import { createFilter, createSelect, pickIdUsingTitle } from "../utils/filters";
import { routes } from "../routing";
import { useGetCategoriesQuery } from "../features/categories.api";

const buttonList = [FacebookButton, LinkedInButton, TwitterButton];

const SingleRadioShow = () => {
  const { id } = useParams();
  const { data: categories } = useGetCategoriesQuery({
    where: createFilter({ label: "title", value: "radio show" }),
    select: createSelect(["id", "title"]),
  });
  const radioShowId = pickIdUsingTitle("radio show", categories?.docs);

  const { data: post, isLoading } = useGetSinglePostQuery(
    {
      id: id as string,
    },
    {
      skip: !id,
    }
  );
  const { data: posts, isLoading: isPostsLoading } = useGetPostsQuery(
    {
      where: {
        and: [
          {
            id: {
              not_equals: id as string,
            },
          },
          {
            categories: {
              contains: radioShowId,
            },
          },
        ],
      },
      limit: 5,
    },
    {
      skip: !id || !radioShowId,
    }
  );

  if (isLoading || isPostsLoading) return <Loader />;

  if (!isLoading && !post)
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        No post found
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-12">
      <section className="flex flex-col gap-3 w-full md:w-4/5 md:gap-5">
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
      </section>
      <section className="flex flex-col gap-5 md:gap-12 md:flex-row">
        <div className="flex flex-col gap-5 w-full md:w-7/10 md:gap-16">
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
        </div>
        <div className="flex flex-col w-full gap-5 md:gap-12 md:w-3/10">
          <div className="flex flex-col bg-primary rounded-md md:rounded-2xl">
            <div className="bg-white rounded-t-md md:rounded-t-2xl">
              <p className="bg-primary p-5 rounded-t-md rounded-bl-md md:rounded-bl-2xl md:rounded-t-2xl md:p-8">
                Subscribe to listen to{" "}
                <strong className="font-poppins-semi-bold">#BeAware</strong>{" "}
                Radio Shows
              </p>
            </div>
            <div className="flex">
              <div className="bg-primary w-full md:w-4/5">
                <div className="bg-white p-3 pb-0 ps-0 rounded-tr-md md:ps-0 md:rounded-tr-2xl md:pt-3 md:pb-0 md:px-3">
                  <a
                    href="#"
                    target="_blank"
                    className="flex justify-between items-center gap-3 bg-secondary text-primary cursor-pointer rounded-4xl p-1 ps-2 md:ps-4"
                  >
                    <span>Subscribe</span>
                    <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
                      <ArrowUpRight />
                    </div>
                  </a>
                </div>
              </div>

              <div className="hidden w-1/5 bg-white md:flex">
                <div className="w-full h-full bg-primary rounded-b-md md:rounded-b-2xl"></div>
              </div>
            </div>
          </div>
          <p>Get update to every weeks post of #BeAware Radio Shows</p>
          <div className="flex flex-col gap-2 bg-[#F3F3F3] rounded-md p-5 md:p-8 md:rounded-2xl md:gap-6">
            <h3 className="font-poppins-medium">Recent Posts</h3>
            {posts && posts.docs.length ? (
              <div className="grid grid-cols-1 gap-3 md:gap-6">
                {posts.docs.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`${routes.Posts.absolute}/${doc.id}`}
                    className="flex flex-col gap-2"
                  >
                    <h4 className="font-poppins-medium">{doc.title}</h4>
                    <small className="text-[#0B121580]">
                      {formatDateTime(doc.createdAt)}
                    </small>
                    <hr className="w-full h-[1px] border-0 bg-[#D5D5D5]" />
                  </Link>
                ))}
              </div>
            ) : (
              <p>No recent posts</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleRadioShow;
