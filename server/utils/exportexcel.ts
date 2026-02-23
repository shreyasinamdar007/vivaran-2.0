import type { Buffer } from "node:buffer";

import ExcelJS from "exceljs";

import type { Company, MonthlyRegister } from "../../interfaces/company.interface";

export async function exportMonthlyRegisterToExcel(
  register: MonthlyRegister,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Common columns for both sheets
  const columns = [
    { header: "Invoice No", key: "invoiceNo", width: 18 },
    { header: "Invoice Date", key: "invoiceDate", width: 15 },
    { header: "Company Name", key: "companyName", width: 30 },
    { header: "GST No", key: "gstNo", width: 18 },
    { header: "GST Type", key: "gstType", width: 20 },
    { header: "Gross Amount", key: "grossAmount", width: 15 },
    { header: "CGST", key: "cgst", width: 15 },
    { header: "SGST", key: "sgst", width: 15 },
    { header: "IGST", key: "igst", width: 15 },
    { header: "Total Tax", key: "totalTax", width: 15 },
    { header: "Total After Tax", key: "totalAfterTax", width: 18 },
  ];

  // Helper to create sheet
  const createSheet = (
    name: string,
    data: Company[],
    grossTotal: number,
    gstTotal: number,
    netTotal: number,
  ) => {
    const sheet = workbook.addWorksheet(name);

    // Set column widths and keys (without auto-generating a header row)
    sheet.columns = columns.map(({ key, width }) => ({ key, width }));

    // Row 1: Month + Year title
    sheet.mergeCells("A1", "K1");
    sheet.getCell("A1").value = `Month: ${register.month} | Year: ${register.year}`;
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    // Row 2: empty spacer
    sheet.addRow([]);

    // Row 3: Table heading row
    const headerRow = sheet.addRow(columns.map(col => col.header));
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0D9488" }, // teal-600
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center" };
    });

    // Data rows
    data.forEach((bill) => {
      sheet.addRow({
        ...bill,
        gstType: bill.gstType === "inter_state" ? "9% CGST + 9% SGST" : "18% IGST",
        invoiceDate: bill.invoiceDate
          ? new Date(bill.invoiceDate).toLocaleDateString("en-GB")
          : "",
      }).alignment = { horizontal: "center" };
    });

    // Calculate CGST, SGST, IGST totals
    const cgstTotal = data.reduce((sum, bill) => sum + (bill.cgst || 0), 0);
    const sgstTotal = data.reduce((sum, bill) => sum + (bill.sgst || 0), 0);
    const igstTotal = data.reduce((sum, bill) => sum + (bill.igst || 0), 0);

    sheet.addRow([]);

    // Totals row
    const totalsRow = sheet.addRow({
      invoiceNo: "",
      invoiceDate: "",
      companyName: "Total",
      gstNo: "",
      gstType: "",
      grossAmount: grossTotal,
      cgst: cgstTotal,
      sgst: sgstTotal,
      igst: igstTotal,
      totalTax: cgstTotal + sgstTotal + igstTotal,
      totalAfterTax: netTotal,
    });
    totalsRow.font = { bold: true };
    totalsRow.alignment = { horizontal: "center" };

    // Currency formatting
    ["grossAmount", "cgst", "sgst", "igst", "totalTax", "totalAfterTax"].forEach(
      (key) => {
        sheet.getColumn(key).numFmt = "₹#,##0.00";
      },
    );
  };

  // Create both sheets with their respective totals
  createSheet("Sales", register.sales, register.salesGrossTotal, register.salesGstTotal, register.salesNetTotal);
  createSheet("Purchase", register.purchase, register.purchaseGrossTotal, register.purchaseGstTotal, register.purchaseNetTotal);

  return workbook.xlsx.writeBuffer();
}
