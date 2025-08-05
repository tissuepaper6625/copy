import crypto from "crypto";
import jwt from "jsonwebtoken";
const COOKIE_NAME = "toauth2";
const JWT_SECRET = process.env.JWT_SECRET;

export const generateState = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generatePKCE = () => {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  return {
    codeVerifier,
    codeChallenge: crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url"),
  };
};

export function addCookieToRes(res, user) {
  const token = jwt.sign(user, JWT_SECRET);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 7200 * 1000),
  });
}

export const decodeJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
