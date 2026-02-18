import Company from "~/server/models/company.model";

export default defineEventHandler(async (event) => {
  const company = await readBody(event);

  try {
    const newCompany = await Company.create(company);
    return { data: newCompany, success: true, message: "New company has been added successfully!" };
  }
  catch (error) {
    throw createError({ statusCode: 500, message: `Failed to create company: ${error}` });
  }
});
