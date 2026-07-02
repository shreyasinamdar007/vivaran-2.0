export type CompanyAddress = {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
};

export type CompanyData = {
  _id: string;
  name: string;
  company_type: string;
  gst_no: string;
  address: CompanyAddress;
  name_of_owner: string;
  mobile_no_1: string;
  mobile_no_2?: string;
};

export type Company = {
  invoiceNo: string;
  invoiceDate: Date;

  companyName: string;
  companyType: string;

  gstType: string; // e.g. "inter_state" | "out_of_state" (can be narrowed)
  gstNo: string;

  sgst: number;
  cgst: number;
  igst: number;

  grossAmount: number;
  extraCharge: number;
  totalTax: number;
  totalAfterTax: number;

  numberOfItems: number;
  totalQuantity: number;
};

export type Month
  = | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";

export type MonthlyRegister = {
  year: number;
  month: string;

  sales: Company[];
  purchase: Company[];

  purchaseGrossTotal: number;
  salesGrossTotal: number;

  salesNetTotal: number;
  purchaseNetTotal: number;

  purchaseGstTotal: number;
  salesGstTotal: number;
};
