import type { Buffer } from "node:buffer";

import ExcelJS from "exceljs";

import type { Company, MonthlyRegister } from "../../interfaces/company.interface";

export async function exportMonthlyRegisterToExcel(
  register: MonthlyRegister,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Common columns for both sheets
  const baseColumns = [
    { header: "Invoice No", key: "invoiceNo", width: 18 },
    { header: "Invoice Date", key: "invoiceDate", width: 15 },
    { header: "Company Name", key: "companyName", width: 30 },
    { header: "GST No", key: "gstNo", width: 18 },
    { header: "Gross Amount", key: "grossAmount", width: 15 },
    { header: "CGST", key: "cgst", width: 15 },
    { header: "SGST", key: "sgst", width: 15 },
    { header: "IGST", key: "igst", width: 15 },
    { header: "Total Tax", key: "totalTax", width: 15 },
    { header: "Total After Tax", key: "totalAfterTax", width: 18 },
    { header: "Number of Items", key: "numberOfItems", width: 15 },
    { header: "Total Quantity", key: "totalQuantity", width: 15 },
  ];

  // Helper to create sheet
  const createSheet = (
    name: string,
    data: Company[],
    grossTotal: number,
    gstTotal: number,
    netTotal: number,
  ) => {
    const isSales = name === "Sales";
    const columns = isSales
      ? [...baseColumns, { header: "HSN Code", key: "hsnCode", width: 15 }]
      : baseColumns;

    const sheet = workbook.addWorksheet(name);

    // Set column widths and keys (without auto-generating a header row)
    sheet.columns = columns.map(({ key, width }) => ({ key, width }));

    // Row 1: Month + Year title (merge across all columns)
    const lastCol = String.fromCharCode(64 + columns.length); // A=1, B=2, ...
    sheet.mergeCells("A1", `${lastCol}1`);
    sheet.getCell("A1").value = `Month: ${register.month} | Year: ${register.year}`;
    sheet.getCell("A1").font = { bold: true, size: 14 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    // Row 2: empty spacer
    sheet.addRow([]);

    // Row 3: Table heading row
    const headerRow = sheet.addRow(columns.map(col => col.header));
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = name === "Sales" ? {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0D9488" }, // teal-600
      } : {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "a91d1d" }, // red-800
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center" };
    });

    // Data rows
    data.forEach((bill) => {
      const rowData: Record<string, any> = {
        ...bill,
        invoiceDate: bill.invoiceDate
          ? new Date(bill.invoiceDate).toLocaleDateString("en-GB")
          : "",
      };
      if (isSales) {
        rowData.hsnCode = 8504;
      }
      sheet.addRow(rowData).alignment = { horizontal: "center" };
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
