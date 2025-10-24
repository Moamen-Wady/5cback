import mongoose, { Schema, Document, Model } from "mongoose";

interface IAdmin extends Document {
  email: string;
  pw: string;
}

const adminSchema: Schema = new mongoose.Schema({
  email: { type: String, required: true },
  pw: { type: String, required: true },
});

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
