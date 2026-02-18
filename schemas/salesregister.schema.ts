import { z } from "zod";

import { CompanyType, GstType, Months } from "@/enums/form.enums";

export const stepSchemas = [
  z.object({
    month: z.nativeEnum(Months),
    year: z.number().min(4, "Enter valid year"),
  }),
  z.object({
    companyName: z.string().min(1, "Company name is required"),
    gstNo: z.string().optional(),
    companyType: z.nativeEnum(CompanyType),
    grossAmount: z.number({ invalid_type_error: "Enter a number" }).min(0),
    gstType: z.nativeEnum(GstType),
    extraCharge: z.number().default(0),
    totalAfterTax: z.number().optional(),
  }),
];
