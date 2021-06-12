import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { config } from './config/config';
import { IndexRouter } from './controllers/v0/index.router';
import { V0MODELS } from './controllers/v0/model.index';
import { sequelize } from './sequelize';
import { timedLogEnd, timedLogStart } from './utils/timedLog';

const c = config;

console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log('config.host: ' + c.host);
console.log('config.database: ' + c.database);
console.log('config.username: ' + c.username);
console.log('config.aws_profile: ' + c.aws_profile);
console.log('config.aws_region: ' + c.aws_region);
console.log('config.aws_media_bucket: ' + c.aws_media_bucket);
console.log('config.url: ' + c.url);
console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

(async () => {
  // REBH: Additional check because of pg issue fixed by upversioning pg or reverting to Node v12
  try {
    await sequelize.authenticate({
      logging: console.log
    });
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await sequelize.addModels(V0MODELS);
  await sequelize.sync(
    // REBH: use 'force: true' to drop tables first
    {
      // force: true
    }
  );

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  // Preset the status to indicated that the request is not found rather than 200 OK
  // This will be picked up below when checking for unhandled URLs.
  // This affected CORS which needs the 200 status.
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404);
    next();
  });

  // Log the start of all requests
  app.use(timedLogStart);

  // Parse JSON encoded bodies
  app.use(express.json());

  // Parse URL encoded bodies
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // CORS restricted to frontend
  // Added status 200 due the above code setting the new default to be 404.
  app.use(cors({
    origin: c.url,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200
  }));

  app.use('/api/v0', IndexRouter);

  // all good requests and non-handled requests will end here
  // This is necessary because send has been used all over the place - not good
  app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log('Fall through');

    // catch the unmapped request URL and raise as an error
    if (res.statusCode === 404) {
      return next(new Error('File Not Found'));
    }

    // good requests pass through
    next();
  });

  // explicit request errors come here
  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.log('Handled ERROR');

    // If there is an error message then
    if (err.message) {
      // the response should not have already been sent - so send it now
    res.send({ status: res.statusCode, error: err.message });
      res.statusMessage = err.message;
    } // else the message should already be in a send 

    // bad requests are logged below
    next();
  });

  // Log the end of all requests - error and good
  app.use(timedLogEnd);


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
