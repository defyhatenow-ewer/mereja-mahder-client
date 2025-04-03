import { Back, Close, Next } from "./Icons";

type Props = {
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  slides: string[];
};

const ImageLightbox = ({ currentSlide, setCurrentSlide, slides }: Props) => {
  return (
    <dialog id="lightbox" className="modal h-screen w-screen text-white">
      <div className="modal-box max-w-[100vw] max-h-screen rounded-none bg-black/65 h-screen w-screen flex flex-col gap-5 p-5 md:p-8 md:gap-8">
        <div className="flex justify-end">
          <form method="dialog" className="w-fit">
            <button>
              <Close />
            </button>
          </form>
        </div>
        <div className="flex justify-between items-center gap-1 max-w-[100vw] md:gap-5">
          <button
            disabled={currentSlide === 0}
            aria-disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((slide) => slide - 1)}
          >
            <Back />
          </button>
          <img
            src={slides[currentSlide]}
            className="w-[70vw] md:w-auto md:h-[75vh]"
          />
          <button
            disabled={currentSlide === slides.length - 1}
            aria-disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide((slide) => slide + 1)}
          >
            <Next />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ImageLightbox;
