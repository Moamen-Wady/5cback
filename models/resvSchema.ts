import mongoose, { Schema, Document, Model } from "mongoose";

interface IResv extends Document {
  userName: string;
  phoneNum1: string;
  year: string;
  sid: string;
  code: string;
}

const resvSchema: Schema = new mongoose.Schema({
  userName: { type: String, required: true },
  phoneNum1: { type: String, required: true },
  year: { type: String, required: true },
  sid: { type: String, required: true },
  code: { type: String, required: true },
});

const Resv: Model<IResv> = mongoose.model<IResv>("Resv", resvSchema);

export default Resv;
