import { Link } from "react-router-dom";
import { Loader } from "../../components";
import { ChevronLeft, ChevronRight } from "../../components/Icons";
import { config } from "../../config";
import { useGetBannersQuery } from "../../features/banners.api";
import { routes } from "../../routing";
import { useGetMaterialsQuery } from "../../features/materials.api";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const FellowsOverview = () => {
  const { t } = useTranslation();
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  const { data: banners, isLoading: isLoadingBanner } = useGetBannersQuery({
    query: {
      where: {
        "space.title": {
          equals: "aff",
        },
      },
    },
  });
  const { data: materials, isLoading: isMaterialsLoading } =
    useGetMaterialsQuery({
      options: {
        limit: 6,
      },
    });

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: "prev" | "next") => {
    if (direction === "prev") {
      return currentIndex <= 0;
    }

    if (direction === "next" && carousel.current !== null) {
      console.log({
        next:
          carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current,
      });
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, [currentIndex]);

  return (
    <>
      <Loader show={isLoadingBanner || isMaterialsLoading} />
      <div className="flex flex-col gap-5 md:gap-10">
        {banners && banners.docs.length && (
          <section className="flex flex-col justify-between items-center gap-5 bg-primary p-5 rounded-md md:rounded-4xl md:p-8 md:flex-row">
            <div className="flex flex-col gap-5 w-full items-center md:items-start md:w-1/2 md:gap-5">
              <p>{t("upcomingActivity")}</p>
              <h2 className="text-lg font-poppins-semi-bold md:text-2xl">
                {banners.docs[0].title}
              </h2>
              {banners.docs[0].links.length &&
                banners.docs[0].links[0].links?.length &&
                banners.docs[0].links[0].links[0].link.url && (
                  <a
                    className="bg-secondary text-white hover:text-primary text-xs px-5 py-2 rounded-2xl w-fit"
                    href={banners.docs[0].links[0].links[0].link.url}
                    target={
                      banners.docs[0].links[0].links[0].link.newTab === true
                        ? "_blank"
                        : "_self"
                    }
                  >
                    {banners.docs[0].links[0].links[0].link.label}
                  </a>
                )}
            </div>
            {typeof banners.docs[0].image === "string" ? (
              <img
                className="max-h-64 md:-mb-16"
                src={`${config.env.apiKey}${banners.docs[0].image}`}
              />
            ) : (
              <img
                className="max-h-64 md:-mb-16"
                src={`${config.env.apiKey}${banners.docs[0].image.url}`}
              />
            )}
          </section>
        )}
        <section className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg">{t("continueLearning")}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={movePrev}
                disabled={isDisabled("prev")}
                className={`${isDisabled("prev") ? "cursor-not-allowed" : "cursor-pointer hover:bg-secondary hover:text-primary hover:border-none"} flex justify-center items-center text-[#9E9E9E] border-1 border-[#9E9E9E] rounded-full p-1`}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={moveNext}
                // disabled={isDisabled("next")}
                className="flex justify-center items-center cursor-pointer text-[#9E9E9E] border-1 border-[#9E9E9E] rounded-full p-1 hover:bg-secondary hover:text-primary hover:border-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div
            ref={carousel}
            className="flex gap-10 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0 items-end"
          >
            {materials &&
              materials.docs.map((material) => (
                <Link
                  key={material.id}
                  className="flex flex-col gap-5 relative snap-start min-w-fit p-3 rounded-2xl hover:shadow-2xl"
                  to={`${routes.Materials.absolute}/${material.slug}`}
                >
                  {typeof material.featuredImage === "string" && (
                    <img
                      src={`${config.env.apiKey}${material.featuredImage}`}
                      className="rounded-md object-cover object-center h-40 w-64"
                    />
                  )}
                  {material.featuredImage &&
                    typeof material.featuredImage !== "string" && (
                      <img
                        src={`${config.env.apiKey}${material.featuredImage.url}`}
                        className="rounded-md object-cover object-center h-40 w-64"
                      />
                    )}
                  <h3 className="text-sm text-wrap max-w-64 child-title">
                    {material.title}
                  </h3>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default FellowsOverview;
