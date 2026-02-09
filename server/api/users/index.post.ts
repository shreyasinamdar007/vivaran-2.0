import User from "~/server/models/user.model";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  try {
    const newUser = await User.create({ email, password });
    return newUser;
  }
  catch (e) {
    throw createError({ statusCode: 500, message: `Failed to create user: ${e}` });
  }
});
