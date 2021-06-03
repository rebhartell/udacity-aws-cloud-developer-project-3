import bodyParser from 'body-parser';
import express from 'express';
import { IndexRouter } from './controllers/v0/index.router';
import { V0MODELS } from './controllers/v0/model.index';
import { sequelize } from './sequelize';





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

  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });

  // this matches all routes and all methods
  app.use((req, res, next) => {
    res.status(404).send({
      status: 404,
      error: "Not found"
    })
  })

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();