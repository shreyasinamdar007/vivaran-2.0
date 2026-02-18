import Company from "~/server/models/company.model";

export default defineEventHandler(async () => {
  try {
    const companies = await Company.find().lean();
    return { data: companies, success: true };
  }
  catch (error) {
    throw createError({ statusCode: 500, message: `Failed to get companies: ${error}` });
  }
});
