const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');
const Notification = require('../models/notification');
const { authCheck } = require("../middlewares/_auth");
const User = require("../models/user");

const jwt = require('jsonwebtoken');

const key = 'c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e';

const getUser = (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Authentication error: no token provided' });
    }
    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        return (req.user)
    } catch (err) {
        return err
    }
};

router.get('/', authCheck, async (req, res) => {
    try {
        const userId = getUser(req, res)._id
        const user = await User.findById(userId)
        if (user.is_admin) {
            const jobs = await Job.find();
            return res.send(jobs);
        } else {
            const jobs = await Job.find({is_approved: true});
            return res.send(jobs);
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


router.post('/new', authCheck, async (req, res) => {
    try {
        const { position, company, location, description } = req.body;
        const created_by = req.user._id;
        const created_at = new Date();
        const newJob = new Job({
            position,
            company,
            location,
            description,
            created_by,
            created_at,
            is_approved: false
        });

        const savedJob = await newJob.save();

        const notification = new Notification({
            message: `New job posted by an Alumni: ${savedJob.position} at ${savedJob.company}`,
            created_at: new Date(),
            for_admin: true,
        });

        await notification.save();

        res.send({ job: savedJob });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// router.put('/update/:id', authCheck, async (req, res) => {
//     if (!req.body) {
//         return res.status(400).send({ error: 'Job data is required' });
//     }

//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['position', 'company', 'location', 'description', 'is_approved'];
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates' });
//     }

//     try {
//         const job = await Job.findById(req.params.id);
//         if (!job) {
//             return res.status(404).send({ error: 'Job not found' });
//         }
//         updates.forEach(update => job[update] = req.body[update]);
//         await job.save();

//         res.send(job);
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });


router.put('/update/:id', authCheck, async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: 'Job data is required' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['position', 'company', 'location', 'description', 'is_approved'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }

        // Update the job with the provided data
        updates.forEach(update => job[update] = req.body[update]);
        await job.save();

        const notification = new Notification({
            message: `New job posted by an Alumni: ${job.position} at ${job.company}`,
            created_at: new Date(),
            for_admin: false,
        });

        await notification.save();

        // Create and save the notification
        if (job.is_approved) {
            const notification = new Notification({
                message: `A Job with position ${job.position} has been posted!`
            });
            await notification.save();
        }

        res.send(job);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
router.put('/apply/:id', authCheck, async (req, res) => {
    const userId = getUser(req, res)._id
    const user = await User.findById(userId)
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }

        const notification = new Notification({
            message: `An student with name ${user.first_name} ${user.last_name} has applied for job: ${job.position} at ${job.company}`,
            created_at: new Date(),
            for_admin: true,
        });

        await notification.save();

        res.send(job);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



router.delete('/delete/:id', authCheck, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).send({ error: 'Job not found' });
        }
        res.send(job);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;