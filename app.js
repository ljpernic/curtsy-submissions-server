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
                                                                                ////
                                                                                ////
                                                                                //// Later the middleware is used to verify the person is signed in to see the job routes.
                                                                                //// But, we want to add the reader role so that it makes sure you are signed in AS THE CORRECT ROLE.
                                                                                //// Then it will show you the correct dashboard depending on your role. 
                                                                                ////
                                                                                //// That means we should do the role checking server-side. The person tries to log in, the server 
                                                                                //// sees what their role is, and returns the correct dashboard api. 
                                                                                ////
                                                                                //// First user submits credentials and server verifies credentials and checks role using functions in controllers/auth. 
                                                                                //// If the credentials are correct, it returns a token to the browser that lets the user be logged in. 
                                                                                //// Seccond, routes for login and add-reader are created (at routes/auth) using the criteria at controllers/auth, invoking those functions.
                                                                                //// If the functions fail (because of faulty credentials), the routes don't post because the controllers throw an error first.
                                                                                //// Finally, if the routes in routes/auth work (meaning the controller worked), app.js uses api/v1/auth to give access to what was posted in routes/auth to the user.
                                                                                //// Things are only posted through routes/auth, though, if the controller/auth worked (i.e., if the login or registration worked).
                                                                                ////                                                                                
                                                                                //// So then, when someone tries to log in, app.js says, "Try to access the api route," which says, "Try to access the route.post for login," which says, "Try to 
                                                                                //// test the login credentials through the controllers." Then the controller throws an error or tells the route/auth, "Yes, the credentials are valid," which 
                                                                                //// tells the api route, "Yes, we have something to post," which tells app.js, "The user can use my api route."
                                                                                ////
                                                                                //// The middleware/authentication functions then grabs the token from the header, verifies it, and puts the values into req.body. 
                                                                                //// Basically, the token that is sent to the user contains the readerId, name, and role. It shouldn't be decipherable on client-side without 
                                                                                //// the hash key in our hidden env file. So, what middleware/authentication does is deciphers that token when you try to access the jobs route
                                                                                //// (using the same pattern as above) and makes it available in req.body, keeping it server-side.
                                                                                //// 
                                                                                //// We want to keep something like the login function in controllers/auth. It would still send the token to the browser for middleware/authenticate to decipher and use. 
                                                                                //// The question then would be how do we make it so that the server posts a different route to the api based on the route. We would create a new route in routes/auth (/editor-dashboard)
                                                                                //// and check the credentials coming in. Make a bunch of if statements to sort between the routes depending on the returned roles in auth/routes? 
// ROUTERS
const authRouter = require('./routes/auth');                                    // Makes the functions and post method in routes/auth.js available for use below.
const jobsRouter = require('./routes/jobs');                                    // Makes the functions and post method in routes/auth.js available for use below.
const roleRouter = require('./routes/role');                                    // Makes the functions and post method in routes/auth.js available for use below.

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
app.use('/api/v1/role', authenticateReader, roleRouter);                        //// That way, you have to be logged in to see the jobs routes.
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
