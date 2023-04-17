const express = require("express");
const router = express.Router();
const { authCheck } = require("../middlewares/_auth");
const User = require("../models/user");
const multer = require('multer');
const path = require('path');
const Otp = require("../models/otp");
const transporter = require("../config/mail");
const bcrypt = require('bcryptjs');
const generateMessage = require("../utils/message");



const storage = multer.diskStorage({
  destination: './media',
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}${path.extname(file.originalname)}`);
  }
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('avatar');


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb('Error: Images Only!');
  }
}

router.get("/", authCheck, async (req, res) => {
  try {
    const alumnis = await User.find({ is_alumni: true });
    const students = await User.find({ is_student: true });

    res.send({ alumnis, students });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/self', authCheck, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -__v');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


router.post('/otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const code = generateOTP()
    const otp = new Otp({
      code: generateOTP(),
      user: user._id // reference to the user's ID
    });

    await otp.save();

    transporter.sendMail(generateMessage(email, code), function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(200).send({ message: 'Successfully sent' });

  }
  catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put('/:userId', authCheck, async (req, res) => {
  const userId = req.params.userId;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['first_name', 'email', 'password', 'last_name', 'country', 'state', 'city', 'zip', 'phone', 'is_alumni', 'is_student', 'is_active', 'is_admin'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/delete/:id', authCheck, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/upload", authCheck, async (req, res) => {
  // try {
  upload(req, res, async function (err) {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      user.avatar = req.file.filename;
      await user.save();

      res.send(user);
    }
  });
  // } catch (error) {
  //   res.status(500).send({ error: error.message });
  // }
});

router.post('/reset-password', async (req, res) => {
  try {

    const { email, password, code, passwordConfirm } = req.body
    if (password !== passwordConfirm) return res.status(400).send({ error: 'password mismatch' });
    const user = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(201).send({ message: 'Password Changed Successfully' });
  }
  catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
