import type { CompanyData } from "~/interfaces/company.interface";

export type CompanyApiResponse = {
  data: Array<CompanyData>;
  success: boolean;
};
