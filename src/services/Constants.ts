type Config = {
  backendUrl: string;
};

const prod: Config = {
  backendUrl: `https://rt.treibaer.de`,
};

const dev: Config = {
  backendUrl: `https://mac.treibaer.de`,
};

export default process.env.NODE_ENV === `development` ? dev : prod;
