const Reader = require('../models/Reader')                            // Makes the Reader schema and functions from model/Reader.js available.
const jwt = require('jsonwebtoken')                                   // Makes json web token functionality available.
const { UnauthenticatedError } = require('../errors')                 // Makes the unauthenticated error available.

const auth = async (req, res, next) => {
  
  // CHECKS HEADER FOR TOKEN //
  const authHeader = req.headers.authorization                        // Sets the const authHeader to whatever is in req.headers.authorization.
  if (!authHeader || !authHeader.startsWith('Bearer')) {              // If there is nothing there or if it doesn't start with 'Bearer',
    throw new UnauthenticatedError('Authentication invalid. ')        //// it throws an error. Does 'Bearer' need a space after?
  }
  const token = authHeader.split(' ')[1]                              //// Otherwise, it splits out the token (which should have 'Bearer' before it) at the empty space.
                                                                      //// It does this by creating an array using authHeader.split and getting the second ([1]) value.
  try {                                                               //// Then it creates the payload that will include the token processed with the hash key in the .env file 
    const payload = jwt.verify(token, process.env.JWT_SECRET)         //// using the jwt.verify method.
  
  // ATTACHES THE READER TO THE JOBS ROUTE // 
    req.reader = { readerId: payload.readerId, name: payload.name }   // Sets the readerId and token as values from the payload value into the req.reader value.
    next()                                                            //// Essentially, this is just getting the payload and passing in the matching readerId based on 
  } catch (error) {                                                   //// the schema provided by models/Readers.js. 
    throw new UnauthenticatedError('Authentication invalid. ')        //// And if it isn't the right payload, it throws an error.
  }
}

module.exports = auth

////// Note: the payload reader can also be found using .select. Look at the tutorials for how. //////