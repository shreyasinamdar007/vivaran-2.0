import jwt from "jsonwebtoken";

import User from "~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const { jwtSecret } = useRuntimeConfig();

  if (!email) {
    throw createError({ statusCode: 400, message: "Email is required" });
  }

  if (!password) {
    throw createError({ statusCode: 400, message: "Password is required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw createError({ statusCode: 401, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

  setCookie(event, "token", token, {
    httpOnly: true,
    secure: useRuntimeConfig().nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return {
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
    },
  };
});
