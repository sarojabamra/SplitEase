import jwt from "jsonwebtoken";

export const verifyUser = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    console.log(token);
    if (!token) {
      return response
        .status(401)
        .json({ status: false, message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    request.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response
        .status(401)
        .json({ status: false, message: "Token expired." });
    }
    return response
      .status(401)
      .json({ status: false, message: "Invalid token." });
  }
};
