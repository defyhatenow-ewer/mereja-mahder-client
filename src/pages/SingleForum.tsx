import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { Loader } from "../components";
import { useTranslation } from "react-i18next";
import { useGetForumsQuery } from "../features/forums.api";
import {
  useCreateMessageMutation,
  useGetInfiniteMessagesInfiniteQuery,
} from "../features/messages.api";
import { config } from "../config";
import { avatarPlaceholder } from "../assets/images";
import { copyToClipboard, sometimeAgo } from "../utils";
import { Copy, Send, Smile } from "../components/Icons";
import { useMeQuery } from "../features/auth.api";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IMessage } from "../types/forums.types";

const SingleForum = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: userData } = useMeQuery();
  const [sendMessage] = useCreateMessageMutation();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { data: post, isLoading } = useGetForumsQuery(
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

  const {
    data: messages,
    fetchNextPage,
    fetchPreviousPage,
  } = useGetInfiniteMessagesInfiniteQuery(
    {
      query: {
        where: {
          forum: {
            equals: post?.docs[0].id as string,
          },
        },
      },
      options: {
        limit: -1,
      },
    },
    {
      skip: !post || !post.docs.length,
      pollingInterval: 2000,
    }
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

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
    } else if (!slug || !userData || !post || !post.docs.length) {
      toast.error("Something went wrong. Please contact admin");
    } else {
      sendMessage({
        text,
        forum: post.docs[0].id,
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

  if (!isLoading && (!post || !post.docs.length))
    return (
      <div className="flex flex-col bg-white gap-5 p-5 pt-0 md:p-12 md:pt-0 md:gap-16">
        {t("postNotFound")}
      </div>
    );

  if (!post) return <Loader />;

  return (
    <div className="flex flex-col bg-white gap-5 md:gap-8">
      <section className="flex flex-col border-1 border-[#D5D5D5] rounded-md md:rounded-2xl">
        <h2 className="bg-[#F3F3F3] p-5 border-b-1 border-[#D5D5D5] rounded-t-md text-sm md:px-8 md:text-lg md:rounded-t-2xl 2xl:px-12">
          {post.docs[0].title}
        </h2>
        <div
          ref={messageContainerRef}
          onScroll={handleScroll}
          className="flex flex-col gap-5 p-5 rounded-b-md overflow-scroll h-[58vh] md:h-[63vh] md:rounded-b-2xl md:p-8 md:gap-8 2xl:p-12 2xl:gap-12"
        >
          {messages && messages.pages[0].docs.length ? (
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
                    className="flex gap-2 items-center cursor-pointer bg-primary hover:bg-secondary hover:text-primary py-1 px-2 rounded-md text-xs"
                    onClick={() => copyToClipboard(message.text)}
                  >
                    <Copy className="size-3" />
                    <span>{t("copyText")}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>{t("noMessagesFound")}</p>
          )}
          <form
            ref={inputRef}
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
              <small>{t("you")}</small>
            </div>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Share your views..."
                className="input rounded-md w-full bg-[#EBEBEB] flex-grow"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div
                className="cursor-pointer bg-primary p-2 rounded-md text-xs w-fit"
                onClick={() => setOpen((prev) => !prev)}
              >
                <Smile className="size-6" />
              </div>
            </div>
            <EmojiPicker
              open={open}
              height={400}
              onEmojiClick={(emoji) =>
                setText((prev) =>
                  prev === "" ? emoji.emoji : `${prev} ${emoji.emoji}`
                )
              }
            />
            <button
              className="cursor-pointer bg-primary p-2 rounded-md text-xs w-fit"
              type="submit"
              ref={buttonRef}
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
