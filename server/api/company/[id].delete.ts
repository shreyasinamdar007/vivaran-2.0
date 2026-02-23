import Company from "~/server/models/company.model";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      throw createError({ statusCode: 404, message: "Company not found" });
    }

    return { success: true, message: "Company deleted successfully!" };
  }
  catch (error: any) {
    if (error.statusCode === 404)
      throw error;
    throw createError({ statusCode: 500, message: `Failed to delete company: ${error}` });
  }
});
