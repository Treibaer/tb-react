type Config = {
  loginBackendUrl?: string;
  backendUrl: string;
  isDemoMode?: boolean;
};

const prod: Config = {
  backendUrl: `https://rt.treibaer.de`,
};

const dev: Config = {
  loginBackendUrl: `https://mac.treibaer.de`,
  backendUrl: `http://localhost:3052`,
  // backendUrl: `https://portfolio.treibaer.de:3063`,
};

export default process.env.NODE_ENV === `development` ? dev : prod;
