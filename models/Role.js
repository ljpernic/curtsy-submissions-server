//////// ROLE MODEL ////////

const mongoose = require('mongoose')                                            // Makes the mongoose package available to handle schema creation.

const RoleSchema = new mongoose.Schema({                                      // This schema is used to add new readers. This should be internal though!
  roleTitle: {
    type: String,
    enum: ['firstRole', 'secondRole', 'thirdRole'],                           // Sets an array with possible values.
    default: 'firstRole',                                                       // Sets the default value.
  },
})

module.exports = mongoose.model('Role', RoleSchema)
