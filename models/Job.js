const mongoose = require('mongoose')                                            // Makes the mongoose functions available.

const JobSchema = new mongoose.Schema(
  {
    company: {                                                                  // First property of the schema. This will be submitter name.
      type: String,                                                             // Sets type.
      required: [true, 'Please provide company name. '],                        // Makes it required.
      maxlength: 50,                                                            // Sets a max length for the input.
    },
    position: {                                                                 // The first two properties are user input. This will be submitter email. 
      type: String,                                                             //// We also need word count, file, etc.
      required: [true, 'Please provide position. '],
      maxlength: 100,
    },
    status: {                                                                   // This property is internal and manipulated by the reader.
      type: String,
      enum: ['pending', 'declined', 'rewrite requested', 'accepted'],           // Sets an array with possible values.
      default: 'pending',                                                       // Sets the default value.
    },
    createdBy: {                                                                // This ties the job model to the user model. Whenever a job is created, 
      type: mongoose.Schema.Types.ObjectId,                                            //// it associates it with a reader. 
      ref: 'Reader',                                                            //// This is the other model it will use as a reference. From the auth middleware?
      required: [true, 'Please provide reader. '],
    },
  },
  { timestamps: true }                                                          // This automatically adds the timestamp.
)

module.exports = mongoose.model('Job', JobSchema)
