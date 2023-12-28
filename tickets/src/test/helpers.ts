import jwt from "jsonwebtoken";

export const signin = () => {
  // create jwt token with email and id as payload
  const payload = { id: "1234", email: "test@test.com" };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // create session object
  const session = {
    token,
  };

  // encode to base64
  const endcodedSession = Buffer.from(JSON.stringify(session)).toString(
    "base64"
  );

  // return the cookie string
  return [`session=${endcodedSession}; path=/; httponly`];
};
