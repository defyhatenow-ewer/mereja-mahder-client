type Props = {
  show?: boolean;
};

const Loader = ({ show }: Props) => (
  <div
    className={`z-[9999] ${show ? "" : "hide"} flex items-center justify-center h-screen fixed left-0 top-0 w-screen z-50 bg-white opacity-100 transition-all ease-linear`}
  >
    <span className="loading loading-ring loading-lg"></span>
  </div>
);

export default Loader;
