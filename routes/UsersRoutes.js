const router = require("express").Router();
const User = require("../model/UserModel");
const bcrypt = require("bcrypt");

//uppdate a user

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been Updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to take this action");
  }
});

//delete a user

router.delete("/:id", async (req, res) => {
  //this will check the user id passing by the client side is equal to the id requested in params,
  //this code is used to check that a user can only delete its own account
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been Deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to take this action");
  }
});
//get a user

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("user Has been followed");
      } else {
        res.status(403).json("you are alredy follow this user");
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(403).json("You can follow yourself !");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user Has been unfollowed");
      } else {
        res.status(403).json("you are alredy unfollow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cant unfollow yourself !");
  }
});

module.exports = router;
