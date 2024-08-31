const setFavicon = () => {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/x-icon";

  if (process.env.REACT_APP_ENV === "production") {
    favicon.href = `${process.env.PUBLIC_URL}/favicon_prod.ico`;
  } else {
    favicon.href = `${process.env.PUBLIC_URL}/favicon_dev.ico`;
  }

  const head = document.querySelector("head");
  const existingFavicon = head?.querySelector('link[rel="icon"]');
  if (existingFavicon) {
    head?.removeChild(existingFavicon);
  }
  head?.appendChild(favicon);
};

export default setFavicon;
