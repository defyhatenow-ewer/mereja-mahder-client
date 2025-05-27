if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swPath = import.meta.env.DEV
      ? "/dev-sw.js?dev-sw" // used only when devOptions.enabled: true
      : "/service-worker.js";
    navigator.serviceWorker
      .register(swPath, { scope: "/" })
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
