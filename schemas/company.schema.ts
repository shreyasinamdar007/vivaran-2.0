import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  company_type: z.string().min(1, "Company type is required"),
  gst_no: z.string().min(1, "GST is required"),

  name_of_owner: z.string().min(1, "Owner name is required"),

  mobile_no_1: z.coerce
    .number()
    .min(1000000000, "Invalid mobile number"),

  mobile_no_2: z.coerce
    .number()
    .optional(),

  address: z.object({
    address_line_1: z.string().min(1, "Address Line 1 is required"),
    address_line_2: z.string().min(1, "Address Line 2 is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipcode: z.coerce
      .number()
      .min(100000, "Invalid zipcode"),
  }),
});
