const express = require('express')                              // Makes the express functionality availability to set up the router.
const router = express.Router()                                 // Makes the router functionality within express available and set to 'router'.
const {                                                         // Makes the functions addReader and login available from controllers/auth.js.
    addReader, 
    login,
    // isChiefEditor,
    // isAssistantEditor
        } = require('../controllers/auth')
router.post('/add-reader', addReader)                           // Lets us assign the post methods that invoke the controller function addReader.
router.post('/login', login)                                    // Lets us assign the post methods that invoke the controller function addReader.
// router.post('/editor-dashboard', isChiefEditor)                                    // Lets us assign the post methods that invoke the controller function addReader.
// router.post('/assistant-dashboard', isAssistantEditor)                                    // Lets us assign the post methods that invoke the controller function addReader.

module.exports = router                                         // Makes the router available everywhere.
