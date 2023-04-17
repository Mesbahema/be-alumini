const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { authCheck } = require("../middlewares/_auth");

router.get('/', authCheck, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        if (!notifications || !notifications.length) {
            return res.status(404).send({ error: 'There are no recent Notifications' });
        }
        res.send(notifications);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/seen', authCheck, async (req, res) => {
    const { userId, ids } = req.body;
    const notifs = await Promise.all(ids.map(async (notif) => {

        const notification = await Notification.findById(notif)
        notification.seens = [...notification.seens, userId]

        await notification.save();
    }))

    res.status(201).send({ message: 'seen' });
})

module.exports = router;