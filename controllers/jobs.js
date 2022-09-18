const Job = require('../models/Job')                                                  // The constant 'Job' relies on the schema defined in /models/Job.
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

// FUNCTION TO GET ALL JOBS FOR A PARTICULAR READER //
const getAllJobs = async (req, res) => {                                              // Function to get all jobs,
  const jobs = await Job.find({ createdBy: req.reader.readerId }).sort('createdAt')   //// sorted by readerId of the person currently signed in and the time of creation.
//  console.log(req.reader)
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })                       //// Then it returns the jobs and the number of jobs. We need the length on the front end.
}

// FUNCTION TO GET SPECIFIC JOB //
const getJob = async (req, res) => {                                                  // Function to get individual job,  
  const {
    reader: { readerId },                                                             //// using the readerId of the person signed in and
    params: { id: jobId },                                                            //// the jobId of the job being singled out, both of which are
  } = req                                                                             // assigned the req constant.

  const job = await Job.findOne({                                                     //// It then looks for the job based on those req values.
    _id: jobId,
    createdBy: readerId,
  })
  if (!job) {                                                                         //// And if it can't find one, it throws an error.
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })                                            //// Otherwise, it returns the inidivual job (containing reader and job IDs)
}

// FUNCTION TO CREATE NEW JOB //
const createJob = async (req, res) => {                                               // Function to create new job.
//  console.log(req.reader)
  req.body.createdBy = req.reader.readerId                                            //// First, it sets the readerId as the createdBy value in the req when the job is created.
  const job = await Job.create(req.body)                                              //// Then it sets as const job all of the values in req.body (the schema properties!), 
  res.status(StatusCodes.CREATED).json({ job })                                       //// which it then returns.
}

// FUNCTION TO UPDATE SPECIFIC JOB //
const updateJob = async (req, res) => {                                               // Function to update individual jobs.
  const {
    body: { company, position },                                                      //// sets 'body' to contain the company and position (will likely become status?),
    reader: { readerId },                                                             //// sets 'reader' to contain the readerId (will become readerId),
    params: { id: jobId },                                                            //// sets 'params' to contain the individual jobId (will become submissionId),
  } = req                                                                             //// and puts them all inside the larger array 'req'.

  if (company === '' || position === '') {                                            //// Then it has an error condition based on company and position, which if passed 
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate(                                            //// locates and attempts to update the job by the given jobId and readerId) and
    { _id: jobId, createdBy: readerId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)                                //// throws an error if the jobId isn't found, and otherwise 
  }
  res.status(StatusCodes.OK).json({ job })                                            //// returns the updated job.
}

// FUNCTION TO DELETE SPECIFIC JOB //
const deleteJob = async (req, res) => {                                               // Function to delete specific job
  const {
    reader: { readerId },                                                             //// based on readerId and jobId.
    params: { id: jobId },                                                            //// First it sets those values as req.
  } = req

  const job = await Job.findByIdAndRemove({                                           //// Then it tries to find and delete that job based on the jobId and readerId.
    _id: jobId,
    createdBy: readerId,
  })
  if (!job) {                                                                         //// If it can't find that jobId, it throws an error.
    throw new NotFoundError(`No job with id ${jobId}. `)
  }
  res.status(StatusCodes.OK).send()                                                   //// Otherwise, it returns a success status code.
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
}
