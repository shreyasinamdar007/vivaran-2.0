import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongoUri);
  }
  catch (e) {
    console.error("Failed to connect to MongoDB", e);
  }
});
