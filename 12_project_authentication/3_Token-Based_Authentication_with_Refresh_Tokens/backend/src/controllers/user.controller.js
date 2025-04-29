import User from "../models/User.model.js";

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
// registration logic
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public (will depend on your session/token setup)
export const logoutUser = (req, res) => {
  // If using sessions:
  // req.session.destroy(() => res.clearCookie("connect.sid").json({ message: "Logged out" }));

  // If using JWT in client-side, client just deletes token.
  res.status(200).json({ message: "Logged out (client should delete token)" });
};
