import { useParams } from "react-router-dom";
import { Loader } from "../components";
import { useTranslation } from "react-i18next";
import { useGetSingleForumQuery } from "../features/forums.api";
import {
  useCreateMessageMutation,
  useGetInfiniteMessagesInfiniteQuery,
} from "../features/messages.api";
import { config } from "../config";
import { avatarPlaceholder } from "../assets/images";
import { copyToClipboard, sometimeAgo } from "../utils";
import { Copy, Send } from "../components/Icons";
import { useMeQuery } from "../features/auth.api";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { IMessage } from "../types/forums.types";

const SingleForum = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: userData } = useMeQuery();
  const [sendMessage] = useCreateMessageMutation();
  const [text, setText] = useState("");
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: post, isLoading } = useGetSingleForumQuery(
    {
      id: id as string,
    },
    {
      skip: !id,
    }
  );

  const {
    data: messages,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetInfiniteMessagesInfiniteQuery(
    {
      query: {
        where: {
          forum: {
            equals: id,
          },
        },
      },
      options: {
        limit: -1,
      },
    },
    {
      skip: !id,
      pollingInterval: 2000,
    }
  );

  const handleScroll = async () => {
    const container = messageContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (Math.abs(scrollHeight - scrollTop - clientHeight) < 1) {
        // Scrolled to the bottom (within a tolerance of 1 pixel to account for potential rounding errors)
        await fetchNextPage();
        // Perform your desired action here, e.g., loading more content
      }
      if (scrollTop === 0) {
        await fetchPreviousPage();
      }
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (text == "") {
      toast.error("Type something first!");
    } else if (!id || !userData) {
      toast.error("Something went wrong. Please contact admin");
    } else {
      sendMessage({
        text,
        forum: id,
        author: userData.user.id,
      })
        .unwrap()
        .then(() => {
          setText("");
        });
    }
  }

  const mergeDocs = () => {
    const conversation: IMessage[] = [];

    if (messages) {
      messages.pages.forEach((page) => {
        conversation.push(...page.docs);
      });
    }

    return conversation.reverse();
  };

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
      <section className="flex flex-col border-1 border-[#D5D5D5] rounded-md md:rounded-2xl">
        <h2 className="bg-[#F3F3F3] p-5 border-b-1 border-[#D5D5D5] rounded-t-md text-sm md:px-8 md:text-lg md:rounded-t-2xl 2xl:px-12">
          {post.title}
        </h2>
        <div
          ref={messageContainerRef}
          onScroll={handleScroll}
          className="flex flex-col gap-5 p-5 rounded-b-md overflow-scroll h-[58vh] md:h-[63vh] md:rounded-b-2xl md:p-8 md:gap-8 2xl:p-12 2xl:gap-12"
        >
          {messages ? (
            [...mergeDocs()].map((message) => (
              <div
                key={message.id}
                className="flex flex-col gap-3 p-5 rounded-md shadow-lg md:gap-5 md:rounded-2xl"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="size-6 rounded-full md:size-12">
                        <img
                          src={
                            typeof message.author !== "string" &&
                            message.author.avatar
                              ? `${config.env.apiKey}${message.author.avatar.thumbnailURL}`
                              : avatarPlaceholder
                          }
                        />
                      </div>
                    </div>
                    <small>
                      {typeof message.author !== "string" &&
                        message.author.name}
                    </small>
                  </div>
                  <small className="text-[#2B3034]">
                    {sometimeAgo(message.createdAt)}
                  </small>
                </div>
                <p>{message.text}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className="flex gap-2 items-center cursor-pointer bg-primary py-1 px-2 rounded-md text-xs"
                    onClick={() => copyToClipboard(message.text)}
                  >
                    <Copy className="size-3" />
                    <span>Copy Text</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No messages in this forum yet</p>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 p-5 rounded-md shadow-lg md:gap-5 md:rounded-2xl"
          >
            <div className="flex items-center gap-2">
              {userData && (
                <div className="avatar">
                  <div className="size-6 rounded-full md:size-12">
                    <img
                      src={
                        userData.user.avatar
                          ? `${config.env.apiKey}${userData.user.avatar.thumbnailURL}`
                          : avatarPlaceholder
                      }
                    />
                  </div>
                </div>
              )}
              <small>You</small>
            </div>
            <input
              type="text"
              placeholder="Share your views..."
              className="input rounded-md w-full bg-[#EBEBEB]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="cursor-pointer bg-primary p-2 rounded-md text-xs w-fit"
              type="submit"
            >
              <Send className="size-3" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SingleForum;
