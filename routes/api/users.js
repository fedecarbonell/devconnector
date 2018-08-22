const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const keys = require("../../config/keys");

// @route   GET api/users/test
// @desc    tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//Load User Model
const User = require("../../models/User");

// @route   GET api/users/register
// @desc    register user
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }) //usa bodyParser
    .then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const avatar = gravatar.url(req.body.email, {
          size: "200",
          rating: "pg",
          default: "mm"
        });
        const newUser = new User({
          name: req.body.name, //viene del react form
          email: req.body.email,
          avatar, //no viene del form
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   GET api/users/login
// @desc    Login user / rerurning the JWT token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email }).then(user => {
    // Check user
    if (!user) {
      return res.status(404).json({ email: "User not foud" });
    }

    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //Sign the token
        JWT.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
