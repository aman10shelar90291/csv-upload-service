// const express = require('express')
import routes from './routes/index.js';
import { connectDb } from './schema/index.js';
import bodyParser from 'body-parser';
import express from 'express';
import fileUpload from "express-fileupload";

const app = express();
const port = 3000
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.use(bodyParser.json({ limit: '20mb' }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use('/' + 'health_check', routes.healthCheck);
app.use('/' + 'user', routes.user);

connectDb().then(async () => {
  app.listen(port, () =>
      console.log(`Application is listening on port ${port}!`));
});
