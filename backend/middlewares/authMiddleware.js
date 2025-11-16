import jwt from "jsonwebtoken";
import Member from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // the logged-in user will now be req.user (NOT req.Member)
      req.user = await Member.findById(decoded.id).select("username email");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res
        .status(401)
        .json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};
