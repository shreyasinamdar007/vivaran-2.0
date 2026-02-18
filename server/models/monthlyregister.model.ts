import mongoose, { Schema } from "mongoose";

const BillSchema = new Schema(
  {
    bill_no: { type: String, required: true, trim: true },

    date: { type: Date, required: true },

    company_name: { type: String, required: true, trim: true },

    gst_no: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: [/^[0-9A-Z]{15}$/, "Invalid GST number"],
    },

    gross_total: { type: Number, required: true, default: 0 },

    sgst9: { type: Number, default: 0 },
    cgst9: { type: Number, default: 0 },
    igst18: { type: Number, default: 0 },

    sgst14: { type: Number, default: 0 },
    cgst14: { type: Number, default: 0 },

    igst28: { type: Number, default: 0 },

    sgst6: { type: Number, default: 0 },
    cgst6: { type: Number, default: 0 },

    total_tax: { type: Number, default: 0 },

    total_items: { type: Number, default: 0 },
    total_quantity: { type: Number, default: 0 },

    net_total: { type: Number, required: true, default: 0 },
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

    purchase_gross_total: { type: Number, default: 0 },
    sales_gross_total: { type: Number, default: 0 },

    sales_net_total: { type: Number, default: 0 },
    purchase_net_total: { type: Number, default: 0 },

    purchase_gst_total: { type: Number, default: 0 },
    sales_gst_total: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Prevent duplicate year + month
MonthlyRegisterSchema.index({ year: 1, month: 1 }, { unique: true });

export default mongoose.models.MonthlyRegister
  || mongoose.model("MonthlyRegister", MonthlyRegisterSchema);
