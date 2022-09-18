const express = require('express')

const router = express.Router()
const {
  getRole,
} = require('../controllers/role')

router.route('/').get(getRole)                                                // Uses the base domain for this function.

module.exports = router
