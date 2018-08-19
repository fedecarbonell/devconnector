const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//Load User Model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

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

module.exports = router;
