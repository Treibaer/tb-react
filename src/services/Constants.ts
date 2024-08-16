type Config = {
  backendUrl: string;
};

const prod: Config = {
  backendUrl: `https://rt.treibaer.de`,
};

const dev: Config = {
  backendUrl: `http://localhost:3052`,
};

export default process.env.NODE_ENV === `development` ? dev : prod;
