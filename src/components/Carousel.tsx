import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import IQueryResult from '../types/IQueryResults';
import {
  IChart,
  ILearningResource,
  IMaterial,
  IReport,
  IResource,
  ISafetyResource,
} from '../types/posts.types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { config } from '../config';
import { routes } from '../routing';
import { ChevronLeft, ChevronRight } from './Icons';

type Props = {
  title: string;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  posts?: IQueryResult<
    | IMaterial
    | IReport
    | IResource
    | IChart
    | ILearningResource
    | ISafetyResource
  >;
};

const Carousel = ({ title, currentIndex, setCurrentIndex, posts }: Props) => {
  const { t } = useTranslation();
  const maxScrollWidth = useRef(0);
  const carousel = useRef<HTMLDivElement>(null);
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

  const isDisabled = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
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
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg">{t(`${title}`)}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={movePrev}
            disabled={isDisabled('prev') || !posts || !posts.docs.length}
            className={`${isDisabled('prev') || !posts || !posts.docs.length ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-secondary hover:text-primary hover:border-none'} flex justify-center items-center text-[#9E9E9E] border-1 border-[#9E9E9E] rounded-full p-1`}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={moveNext}
            disabled={!posts || !posts.docs.length}
            className={`${!posts || !posts.docs.length ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-secondary hover:text-primary hover:border-none'} flex justify-center items-center text-[#9E9E9E] border-1 border-[#9E9E9E] rounded-full p-1`}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={carousel}
        className="flex gap-10 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0 items-end"
      >
        {posts && posts.docs.length ? (
          posts.docs.map((material) => (
            <Link
              key={material.id}
              className="flex flex-col gap-5 relative snap-start min-w-fit p-3 rounded-2xl border-1 border-[#D5D5D5] hover:shadow-xl"
              to={`${routes.Materials.absolute}/${material.slug}`}
            >
              {typeof material.featuredImage === 'string' && (
                <img
                  src={`${config.env.apiKey}${material.featuredImage}`}
                  className="rounded-md object-cover object-center h-40 w-64"
                />
              )}
              {material.featuredImage &&
                typeof material.featuredImage !== 'string' && (
                  <img
                    src={`${config.env.apiKey}${material.featuredImage.url}`}
                    className="rounded-md object-cover object-center h-40 w-64"
                  />
                )}
              <h3 className="text-sm text-wrap max-w-64 child-title">
                {material.title}
              </h3>
            </Link>
          ))
        ) : (
          <p>
            <span>{t(`no`)} </span>
            <span>{t(`${title}`).toLowerCase()}</span>
            <span> {t(`available`)}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Carousel;
