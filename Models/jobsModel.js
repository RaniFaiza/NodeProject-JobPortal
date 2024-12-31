const mongooseVar = require('mongoose');

const jobSchema = mongooseVar.Schema({
    company: {
        type: String,
        required: [true, 'company name is required.']
    },
    position: {
        type: String,
        required: [true, 'Job position is required.'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Pending', 'Reject', 'Interview'],
        default: 'Pending'
    },
    worktype: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    worklocation: {
        type: String,
        default: 'Sargodha',
        required: [true, 'Work location is required.']
    },
    createdby: {
        type: mongooseVar.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

const jobModel = mongooseVar.model('job', jobSchema);

module.exports = {
    jobModel,
}