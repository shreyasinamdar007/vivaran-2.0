import mongoose, { Schema } from "mongoose";

const BillSchema = new Schema(
  {
    invoiceNo: { type: String, required: true, trim: true },

    invoiceDate: { type: Date, required: true },

    companyName: { type: String, required: true, trim: true },

    gstType: { type: String, required: true, trim: true },

    gstNo: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: [/^[0-9A-Z]{15}$/, "Invalid GST number"],
    },

    grossAmount: { type: Number, required: true, default: 0 },

    sgst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },

    totalTax: { type: Number, default: 0 },

    totalAfterTax: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const MonthlyRegisterSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      index: true,
    },

    month: {
      type: String,
      required: true,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      index: true,
    },

    sales: {
      type: [BillSchema],
      default: [],
    },

    purchase: {
      type: [BillSchema],
      default: [],
    },

    purchaseGrossTotal: { type: Number, default: 0 },
    salesGrossTotal: { type: Number, default: 0 },

    salesNetTotal: { type: Number, default: 0 },
    purchaseNetTotal: { type: Number, default: 0 },

    purchaseGstTotal: { type: Number, default: 0 },
    salesGstTotal: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Prevent duplicate year + month
MonthlyRegisterSchema.index({ year: 1, month: 1 }, { unique: true });

export default mongoose.models.MonthlyRegister
  || mongoose.model("MonthlyRegister", MonthlyRegisterSchema);
