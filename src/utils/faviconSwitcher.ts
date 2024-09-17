const setFavicon = () => {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/x-icon";

  if (import.meta.env.MODE === "production") {
    favicon.href = `/favicon_prod.ico`;
  } else {
    favicon.href = `/favicon_dev.ico`;
  }

  const head = document.querySelector("head");
  const existingFavicon = head?.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    head?.removeChild(existingFavicon);
  }
  head?.appendChild(favicon);
};

export default setFavicon;
