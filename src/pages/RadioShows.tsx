import { useState } from "react";
import { Loader, Pagination } from "../components";
import { useGetPostsQuery } from "../features/posts.api";
import { ChevronUp, ChevronDown, Refresh } from "../components/Icons";
import { Link } from "react-router-dom";
import { config } from "../config";
import { routes } from "../routing";
import { createFilter } from "../utils/filters";
import { formatDateTime } from "../utils";

const RadioShows = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetPostsQuery({
    where: createFilter({ label: "title", value: search }, "like"),
    limit: 6,
    page,
  });

  const clearSearch = () => {
    setSearch("");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
      <div className="flex flex-col gap-3">
        <h2>Media Productions</h2>
        <h3 className="text-[#D5D5D5] text-2xl font-poppins">
          Podcasts, Radio talk shows & TV interviews
        </h3>
      </div>
      <section className="flex flex-col gap-5 md:justify-between md:items-center md:gap-8 md:flex-row">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          className="input border-0 w-full bg-[#EBEBEB] p-3 rounded-2xl md:rounded-4xl md:p-6"
          onChange={(e) => setSearch(e.target.value)}
        />
        <details
          id="language-menu"
          className="dropdown dropdown-end bg-[#EBEBEB] text-sm w-full p-2 rounded-2xl md:rounded-4xl md:py-3 md:px-5 md:max-w-[10rem]"
          onToggle={(e) => {
            if (e.currentTarget.open) {
              setOpen(true);
            } else {
              setOpen(false);
            }
          }}
        >
          <summary className="list-none text-white h-full align-middle cursor-pointer">
            <div className="h-full flex justify-between items-center text-black rounded-md">
              <span>{category === "" ? "Category" : category}</span>
              {open ? (
                <ChevronUp className="size-6" />
              ) : (
                <ChevronDown className="size-6" />
              )}
            </div>
          </summary>
          <ul className="p-3 gap-2 shadow menu dropdown-content z-[1] rounded-sm w-32 text-sm">
            <li
              className="cursor-pointer p-1 hover:bg-primary"
              onClick={() => setCategory("category 1")}
            >
              Category 1
            </li>
            <li
              className="cursor-pointer p-1 hover:bg-primary"
              onClick={() => setCategory("category 1")}
            >
              Category 2
            </li>
          </ul>
        </details>
        <button
          onClick={clearSearch}
          aria-disabled={isLoading}
          className="flex justify-between items-center gap-3 bg-secondary text-primary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
        >
          <span>Clear</span>
          <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary">
            <Refresh />
          </div>
        </button>
      </section>
      <section>
        {data && data.docs ? (
          <div className="flex flex-col gap-5 md:gap-8">
            <div className="grid grid-flow-row grid-cols-1 gap-5 md:gap-8 md:grid-cols-3">
              {data.docs.map((post) => (
                <Link
                  to={`${routes.Posts.absolute}/${post.id}`}
                  key={post.id}
                  className="flex flex-col gap-3 md:gap-5"
                >
                  {typeof post.featuredImage === "string" && (
                    <img
                      src={`${config.env.apiKey}${post.featuredImage}`}
                      className="w-full"
                    />
                  )}
                  {post.featuredImage &&
                    typeof post.featuredImage !== "string" && (
                      <img
                        src={`${config.env.apiKey}${post.featuredImage.url}`}
                        className="w-full"
                      />
                    )}
                  <small className="text-[#0B121580]">
                    {formatDateTime(post.createdAt)}
                  </small>
                  <h3>{post.title}</h3>
                </Link>
              ))}
            </div>
            <Pagination
              currentPage={page}
              setPage={setPage}
              totalPages={data.totalPages}
            />
          </div>
        ) : (
          <p>No reports found</p>
        )}
      </section>
    </div>
  );
};

export default RadioShows;
