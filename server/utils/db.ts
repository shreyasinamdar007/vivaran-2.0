import { defineMongooseConnection } from "#nuxt/mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/vivaran";

export const connection = defineMongooseConnection(uri);
