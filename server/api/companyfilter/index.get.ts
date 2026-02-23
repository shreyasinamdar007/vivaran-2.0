import Company from "~/server/models/company.model";

export default defineEventHandler(async () => {
  try {
    const companies = await Company.find().select({ name: 1, company_type: 1, gst_no: 1 });
    return { data: companies, success: true };
  }
  catch (error) {
    throw createError({ statusCode: 500, message: `Failed to get companies: ${error}` });
  }
});
