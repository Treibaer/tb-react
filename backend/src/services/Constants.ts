type Config = {
  backendUrl: string;
};

const prod: Config = {
  backendUrl: `https://rt.treibaer.de`,
};

const dev: Config = {
  backendUrl: `https://mac.treibaer.de`,
  // backendUrl: `https://portfolio.treibaer.de:3063`,
};

export default process.env.NODE_ENV === `development` ? dev : dev;
