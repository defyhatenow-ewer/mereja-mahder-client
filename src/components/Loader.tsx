type Props = {
  show?: boolean;
};

const Loader = ({ show = true }: Props) => (
  <div
    className={`${show ? "" : "hide"} z-[9999] flex flex-col gap-2 items-center justify-center h-screen fixed left-0 top-0 w-screen bg-primary opacity-100 transition-all ease-linear`}
  >
    <p>Getting ready</p>
    <span className="loading loading-dots text-secondary loading-lg md:loading-xl"></span>
  </div>
);

export default Loader;
