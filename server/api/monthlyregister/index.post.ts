import SPRegister from "~/server/models/monthlyregister.model";
import { exportMonthlyRegisterToExcel } from "~/server/utils/exportexcel";

export default defineEventHandler(async (event) => {
  const register = await readBody(event);

  try {
    const buffer = await exportMonthlyRegisterToExcel(register);

    setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    setHeader(event, "Content-Disposition", `attachment; filename=${register.month}-${register.year}-register.xlsx`);

    await SPRegister.create(register);

    return buffer;
  }
  catch (error) {
    throw createError({ statusCode: 500, message: `Failed to create company: ${error}` });
  }
});
