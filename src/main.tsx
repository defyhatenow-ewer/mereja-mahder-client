import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import { AppRouter } from "./routing";

// styles
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// translations
import "./i18n";
import { Loader } from "./components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <RouterProvider router={AppRouter} />
        </PersistGate>
      </Provider>
    </Suspense>
  </StrictMode>
);
