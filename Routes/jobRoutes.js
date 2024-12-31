const express = require('express');
const jobroute = express.Router();
//import file and functions/controller
const { userauth } = require('../Middlewares/authMiddleware');
const { createjob, getAlljobs, updatejob, deletejob, jobStats } = require('../Controllers/jobController');

//routes
//create job
jobroute.post('/create-job', userauth, createjob);

//get job
jobroute.get('/get-jobs', userauth, getAlljobs);

//update job
jobroute.patch('/update-job/:id', userauth, updatejob)

//delete job
jobroute.delete('/delete-job/:id', userauth, deletejob);

//job stats and filters
jobroute.get('/job-stats', userauth, jobStats)
module.exports = {
    jobroute,
}