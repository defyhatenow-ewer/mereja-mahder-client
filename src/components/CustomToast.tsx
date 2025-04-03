import { ToastContainer, Slide } from "react-toastify";

const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Slide}
      theme="dark"
      className="z-[9999]"
    />
  );
};

export default CustomToast;
