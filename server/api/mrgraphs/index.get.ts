import SPRegister from "~/server/models/monthlyregister.model";

export default defineEventHandler(async () => {
  try {
    const monthlyRegisters = await SPRegister.find().select({ year: 1, month: 1, salesGrossTotal: 1, purchaseGrossTotal: 1, salesGstTotal: 1, purchaseGstTotal: 1, salesNetTotal: 1, purchaseNetTotal: 1 });
    return { data: monthlyRegisters, success: true };
  }
  catch (error) {
    throw createError({ statusCode: 500, message: `Failed to get monthly registers: ${error}` });
  }
});
