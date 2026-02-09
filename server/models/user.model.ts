import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S[^\s@]*@\S[^\s.]*\.\S+$/, "Please use a valid email address"] },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 16);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User
  || mongoose.model("User", UserSchema);
