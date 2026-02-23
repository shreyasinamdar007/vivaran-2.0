import Company from "~/server/models/company.model";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  try {
    const updated = await Company.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      throw createError({ statusCode: 404, message: "Company not found" });
    }

    return { data: updated, success: true, message: "Company updated successfully!" };
  }
  catch (error: any) {
    if (error.statusCode === 404)
      throw error;
    throw createError({ statusCode: 500, message: `Failed to update company: ${error}` });
  }
});
