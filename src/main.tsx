import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AppRouter } from "./routing";

// styles
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// translations
import "./i18n";
import { Loader } from "./components";

// sw cache
import "./register-sw";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <RouterProvider router={AppRouter} />
      </Provider>
    </Suspense>
  </StrictMode>
);
