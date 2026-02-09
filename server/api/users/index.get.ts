import User from "../../models/user.model";

export default defineEventHandler(async () => {
  try {
    return await User.find();
  }
  catch (e) {
    throw createError({ statusCode: 500, message: `Failed to fetch users ${e}` });
  }
});
