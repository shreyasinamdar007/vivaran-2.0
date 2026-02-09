import { defineMongooseConnection } from "#nuxt/mongoose";

export const connection = defineMongooseConnection("mongodb://localhost:27017/vivaran");
