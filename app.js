require('dotenv').config();                                                       // Makes the data in the .env file available.
require('express-async-errors');                                                  // Makes the easy errors from the express-async-errors package available.

// EXTRA SECURITY PACKAGES
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// SWAGGER
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// EXPRESS
const express = require('express');                                             // Makes the express package available for use in this file.
const app = express();                                                          // Assigns the express function specifically to the 'app' constant.

const connectDB = require('./db/connect');                                      // Makes the database info in db/connect available.
const authenticateReader = require('./middleware/authentication');              // Makes the authentication middleware available.

// ROUTERS
const authRouter = require('./routes/auth');                                    // Makes the functions and post method in routes/auth.js available for use below.
const jobsRouter = require('./routes/jobs');                                    // Makes the functions and post method in routes/auth.js available for use below.

// ERROR HANDLER
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// SETS SECURITY PARAMETERS //
app.set('trust proxy', 1);                                                      // We need this for everything to work on Heroku
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,                                                   // 15 minutes
    max: 100,                                                                   // limit each IP to 100 requests per windowMs
  })
);

// INVOKES THE SECURITY PACKAGES REQUIRED ABOVE // 
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// DUMMY ROUTE //
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');           // Dummy get route to make sure everything deployed right. 
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ROUTES //
app.use('/api/v1/auth', authRouter);                                            // Assigns the authRouter functions and post methods to this route.
app.use('/api/v1/jobs', authenticateReader, jobsRouter);                        // Assigns the jobsRouter functions and methods to this route, but requires an authenticated reader.
                                                                                //// That way, you have to be logged in to see the jobs routes.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);                                     //// Starts the server by connecting to the database based on the info in the .env file.
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
