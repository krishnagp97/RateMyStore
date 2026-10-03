
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { role },
    secret,
    {
      subject: userId,
      expiresIn: "1d",
    }
  );
};
