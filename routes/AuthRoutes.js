const router = require("express").Router();
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
//Registring User

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //genertate new Hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating User
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // save user and return response
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("No Such user found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      res
        .status(400)
        .json("Bad Credentials, username or password did not match");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
