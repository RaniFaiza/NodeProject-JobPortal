//import 
const { jobModel } = require('../Models/jobsModel');
const mongooseVar = require('mongoose');
const moment = require('moment');
const { query } = require('express');

//********************* create job *********************
async function createjob(req, resp, next) {
    const { company, position, status, worktype, worklocation } = req.body;
    if (!company || !position) {
        return next('Please provide all required fields.');
    }
    req.body.createdby = new mongooseVar.Types.ObjectId(req.user);
    const job = await jobModel.create(req.body);
    resp.status(201).send({ job });
}

//********************* get job *********************
async function getAlljobs(req, resp, next) {
    const { status, worktype, search, sort } = req.query;
    const queryObject = {};
    if (status && status != 'all') {
        queryObject.status = status;
    }
    if (worktype && worktype != 'all') {
        queryObject.worktype = worktype;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' }
    }
    queryObject.createdby = req.user;
    try {
        let jobsQuery = jobModel.find(queryObject);         //as we can't use Array.sort() directly retreived data from db. so we find sorted.
        if (!jobsQuery) {
            return next('No job available.')
        }
        // const sortoption = {
        //     latest: '-createdAt',
        //     oldest: 'createdAt',
        //     'a-z': 'position',
        //     'z-a': '-position'
        // }
        // jobsQuery = jobsQuery.sort(sortoption[sort]); //jobsQuery.sort(createdAt or position etc)
        //josb = await jobsQuery;
        //sorting
        if (sort === 'latest') {
            jobsQuery = jobsQuery.sort('-createdAt'); //descending order
        }
        if (sort === 'oldest') {
            jobsQuery = jobsQuery.sort('createdAt'); //ascending order
        }
        if (sort === 'a-z') {
            jobsQuery = jobsQuery.sort('position'); //ascending order
        }
        if (sort === 'z-a') {
            jobsQuery = jobsQuery.sort('-position'); //descending order
        }
        const totaljobs = await jobModel.countDocuments(jobsQuery);
        //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skipdocs = Number(page - 1) * limit //skip those documents which are part of previous page  if we are on page 2 then previous page's 2 docs shouldn't visible (2-1)*2 = 2; (3-1)*2 = 2*2=4
        jobsQuery = jobsQuery.skip(skipdocs).limit(limit);

        //total pages
        const totalpages = Math.ceil(totaljobs / limit);   //ceil function round of upper nearest number, 3.9 to 4 but floor does reverse
        const jobs = await jobsQuery; //stop executing anyting until assign all jobs
        resp.status(201).send({
            totaljobs,
            jobs,
            totalpages
        })
    }
    catch (err) {
        next(err)
    }
}

//********************* update job *********************
async function updatejob(req, resp, next) {
    const { id } = req.params;
    const { company, position, status, worktype, worklocation } = req.body;
    //validation
    if (!company || !position) {
        return next('Please provide all required fields.');
    }
    //find job
    const job = await jobModel.findOne({ _id: id });
    //validation
    if (!job) {
        return next(`No job found with this id ${id}`);
    }
    if (req.user !== job.createdby.toString()) {
        return next(`You are not uthorized update this job.`);
    }
    const updatedjob = await jobModel.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
    resp.status(200).send({ updatedjob });

}

//********************* delete job *********************
async function deletejob(req, resp, next) {
    const { id } = req.params;
    //find job
    const job = await jobModel.findOne({ _id: id });
    //validation
    if (!job) {
        return next(`No job found with this id ${id}`)
    }
    if (req.user !== job.createdby.toString()) {
        return next(`You are not authorized`)
    }
    //delete job
    await job.deleteOne();
    resp.status(200).send({ message: 'Success , Job deleted Successfully.' });
}

//********************* stats and filters *********************
async function jobStats(req, resp, next) {
    console.log(`req.user ${req.user}`);
    try {
        const stats = await jobModel.aggregate([
            {
                $match: {
                    createdby: new mongooseVar.Types.ObjectId(req.user)
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }, //1 is a constant to count the number of documents. like an increment
                }
            }
        ]);
        const defaultstaus = {
            Pending: stats.Pending || 0,
            Reject: stats.Reject || 0,
            Interview: stats.Interview || 0
        };

        //monthly application
        let monthlyapplication = await jobModel.aggregate([
            {
                $match: {
                    createdby: new mongooseVar.Types.ObjectId(req.user)
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }

                }
            }
        ]);
        monthlyapplication = monthlyapplication.map(variable => {
            const { _id: { year, month }, count } = variable;
            const date = moment().month(month - 1).year(year).format('MMM Y');
            return { date, count };

        }).reverse();
        const totaljobs = await jobModel.countDocuments({
            createdby: new mongooseVar.Types.ObjectId(req.user)
        });

        console.log(stats);
        resp.status(200).json({ totaljobs, defaultstaus, monthlyapplication });
    }
    catch (error) {
        console.error("Error in jobStats:", error.message);
        next(error); // Pass error to the next middleware
    }
}

module.exports = {
    createjob,
    getAlljobs,
    updatejob,
    deletejob,
    jobStats,
}