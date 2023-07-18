const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//@desc get current user
//@route GET /api/users/getUser
//@access public
const getUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
//@desc register the user
//@route GET /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    req.status = 400;
    throw new Error("all fields are mendetory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    req.status = 400;
    throw new Error("user already exist, try with another email address!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password : ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status = 400;
    throw new Error("user data is not valid");
  }
});

//@desc login user
//@route GET /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mendatory!");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid!");
  }
});

module.exports = { getUser, registerUser, loginUser };
