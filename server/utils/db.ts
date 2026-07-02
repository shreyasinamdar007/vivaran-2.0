import { defineMongooseConnection } from "#nuxt/mongoose";

const config = useRuntimeConfig();
const uri = config.mongoUri || "mongodb://localhost:27017/vivaran";

export const connection = defineMongooseConnection(uri);
