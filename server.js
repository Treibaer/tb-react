import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/cert.pem', 'utf8');

const options = {
  key: privateKey,
  cert: certificate
};

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '.', 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
