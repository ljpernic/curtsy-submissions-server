const express = require('express')

const router = express.Router()
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
} = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs)                             // Uses the base domain for this function.

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)           // Uses the id of the specific job for these other functions.

module.exports = router
