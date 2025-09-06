import jwt from "jsonwebtoken";

export const verifyUser = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    console.log(
      "Verifying user with token:",
      token ? "Token exists" : "No token"
    );
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);

    if (!token) {
      console.log("No token provided, returning 401");
      return response
        .status(401)
        .json({ status: false, message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    request.user = decoded;
    console.log("User verified successfully:", decoded);

    next();
  } catch (error) {
    console.error("Token verification error:", error);
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
