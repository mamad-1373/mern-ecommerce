import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized , token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized , no token");
  }
};

// User must be an admin
// const admin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401);
//     throw new Error("Not authorized as an admin");
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user?.isAdmin) {
//     next();
//   } else {
//     res.status(401).send("Not authorized as an admin");
//   }
// };

const isAdmin = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).send("Not authenticated");
  }

  // Check if the user is an admin
  if (req.user.isAdmin) {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).send("Not authorized as an admin");
  }
};
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Not authenticated");
  }
  if (req.user.isAdmin) {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).send("Not authorized as an admin");
  }
};

export { admin, protect };
