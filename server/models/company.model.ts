import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    address_line_1: {
      type: String,
      required: true,
      trim: true,
    },
    address_line_2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    zipcode: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company_type: {
      type: String,
      enum: ["purchase", "sales"],
      required: true,
    },

    gst_no: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[0-9A-Z]{15}$/, "Invalid GST number"],
    },

    address: {
      type: AddressSchema,
      required: true,
    },

    name_of_owner: {
      type: String,
      required: true,
      trim: true,
    },

    mobile_no_1: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid mobile number"],
    },

    mobile_no_2: {
      type: String,
      match: [/^\d{10}$/, "Invalid mobile number"],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Company
  || mongoose.model("Company", CompanySchema);
