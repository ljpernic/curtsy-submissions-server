const Reader = require('../models/Reader.js')                                           // Makes the schema and functions defined in /models/Reader available in const Reader.
const { StatusCodes } = require('http-status-codes')                                    // Makes easy status codes from http-status-code package available.
const { BadRequestError, UnauthenticatedError } = require('../errors')                  // Makes these extra errors available.
const jwt = require('jsonwebtoken')                                                     // Makes jwt package available for creating json web tokens. 

// REGISTRATION FUNCTION  -- SHOULD ONLY BE AVAILABLE TO TOP LEVEL EDITOR // 
const addReader = async (req, res) => {                                                 // Creates asynchronous function called "addReader" which 
  const reader = await Reader.create({ ...req.body })                                   //// creates a 'reader' with Reader data passed in from req.body, then
  const token = jwt.sign(                                                               //// This function is for creating web tokens by 
    { 
      readerId: reader._id, 
      name: reader.name,
      role: reader.role 
    },                                                                                  //// using reader.something to refer to the id and keypair values in the given document,
      process.env.JWT_SECRET,                                                           //// mixing those values with the token key given in the hidden .env file.
    {
      expiresIn: process.env.JWT_LIFETIME,                                              //// It also provides an expiration period based on what's in the .env file. 
    }
  )                                                                                     //// creates a unique JWT token based on that reader data and
  res.status(StatusCodes.CREATED).json({ reader: { name: reader.name }, token })        //// responds with a statuscode based on reader/token data, the reader name and the token.
}                                                                                       // THIS IS WHERE THE TOKEN CONFIRMATION GOES INSTEAD OF THE READER MODEL?

// LOGIN FUNCTION -- SHOULD BE AVAILABLE TO ALL EDITORS AND READERS //
const login = async (req, res) => {                                                     // Function that creates 'email' and 'password' constants with the data
  const { email, password } = req.body                                                  //// passed in from req.body.
  if (!email || !password) {                                                            // If there's no email or password, 
    throw new BadRequestError('Please provide an email and password! ')                 //// it throws an error. 
  }
  const reader = await Reader.findOne({ email })                                        // Otherwise, it looks for the reader that already has the given email.
//  console.log(`controllers/auth req.body: ` + JSON.stringify(reader))
  if (!reader) {                                                                        //// And if there isn't one, it throws an error saying the reader wasn't found.
    throw new UnauthenticatedError('Reader not found. ')
  }
  const isPasswordCorrect = await reader.comparePassword(password)                      // Uses comparePassword function in models/Readers.js to check the password.
  if (!isPasswordCorrect) {                                                             //// If the password is not correct, 
    throw new UnauthenticatedError('Invalid password. ')                                //// it throws an error.
  }
  const token = jwt.sign(                                                               //// This function is for creating web tokens by 
    { 
      readerId: reader._id, 
      name: reader.name,
      role: reader.role 
    },                                                                                  //// using reader.something to refer to the id and keypair values in the given document,
      process.env.JWT_SECRET,                                                           //// mixing those values with the token key given in the hidden .env file.
    {
      expiresIn: process.env.JWT_LIFETIME,                                              //// It also provides an expiration period based on what's in the .env file. 
    }
  )                                                                                    //// creates a unique JWT token based on that reader data and
  res.status(StatusCodes.OK).json({ reader: { name: reader.name, role: reader.role }, token })
                //// responds with a statuscode based on reader/token data, the reader name and the token.
}                                                                                           // THIS IS WHERE THE TOKEN CONFIRMATION GOES INSTEAD OF THE READER MODEL?

module.exports = {                                                                      // Exports the registration and login functions so that they are 
  addReader,                                                                            //// available everywhere.
  login,
}
