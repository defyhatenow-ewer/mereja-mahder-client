import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AppRouter } from "./routing";
import { pdfjs } from "react-pdf";

// styles
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// translations
import "./i18n";
import { Loader } from "./components";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <RouterProvider router={AppRouter} />
      </Provider>
    </Suspense>
  </StrictMode>
);
