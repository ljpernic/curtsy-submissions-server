//////// READER MODEL ////////

const mongoose = require('mongoose')                                            // Makes the mongoose package available to handle schema creation.
const bcrypt = require('bcryptjs')                                              // Makes the bcrypt package available for hashing and comparing passwords.
// const jwt = require('jsonwebtoken')                                             // Makes jwt package available for creating json web tokens. 

const ReaderSchema = new mongoose.Schema({                                      // This schema is used to add new readers. This should be internal though!
  name: {
    type: String,
    required: [true, 'Please provide a name. '],
    maxlength: 50,                                                              // 
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address. '],
    match: [                                                                    // Creates validator with regex that makes sure the email address is formatted correctly.
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email address. ',
    ],
    unique: true,                                                               // Creates a unique index based on the email address. Two readers can't have the same email.
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [
      8,
      'Passwords must be at least eight characters in length. '
    ]
  },
  role: {
    type: String,
    enum: ['subEditor', 'middleEditor', 'chiefEditor'],                           // Sets an array with possible values.
    default: 'subEditor',                                                       // Sets the default value.
  },
})

// FUNCTION TO HASH PASSWORDS //
ReaderSchema.pre('save', async function () {                                    // This function hashes passwords before the values from the schema are saved to the db. 
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// DOESN'T WORK -- MOVED FUNCTIONS TO WHERE THEY WERE BEING CALLED //
// // FUNCTION TO CREATE TOKEN BASED ON DOCUMENT DATA //
// ReaderSchema.methods.createJWT = function () {                                  // Creates function called createJWT using the methods instance using schemaName.methods.functionName. 
//   jwt.sign(                                                                     //// This function is for creating web tokens by 
//     { readerId: this._id, name: this.name },                                    //// using this.something to refer to the id and keypair values in the given document,
//     process.env.JWT_SECRET,                                                     //// mixing those values with the token key given in the hidden .env file.
//     {
//       expiresIn: process.env.JWT_LIFETIME,                                      //// It also provides an expiration period based on what's in the .env file. 
//     }
//   )
// }

// COMPARES PASSWORDS BETWEEN SUBMITTED DATA AND DOCUMENT IN THE DB //
ReaderSchema.methods.comparePassword = async function (canditatePassword) {     // Creates function called comparePassword with the methods instance using schemaName.methods.functionName.
  const isMatch = await bcrypt.compare(canditatePassword, this.password)        // Uses the compare function of the bcrypt package to compare the candidatePassword that comes with a  
  return isMatch                                                                //// request and the password from the document already saved in the database. 
}                                                                               //// Then it returns the match. 

module.exports = mongoose.model('Reader', ReaderSchema)
