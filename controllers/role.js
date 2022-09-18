const Role = require('../models/Role')                                                  // The constant 'Job' relies on the schema defined in /models/Job.
const Reader = require('../models/Reader')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

// FUNCTION TO GET SPECIFIC READER’S ROLE //
const getRole = async (req, res) => {                                                  // Function to get individual job,  
//    console.log(req.reader)
    if (!req.reader) {                                                                         //// And if it can't find one, it throws an error.
      throw new NotFoundError(`No reader found.`)
    }
    const thisRole = req.reader.role
    res.status(StatusCodes.OK).json({ thisRole })                                            //// Otherwise, it returns the inidivual job (containing reader and job IDs)
  }

module.exports = {
  getRole,
}
