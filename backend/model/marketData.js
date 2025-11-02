import mongoose from "mongoose";

const MarketDataSchema = new mongoose.Schema(
  {
    State: { type: String },
    District: { type: String },
    Market: { type: String },
    Commodity: { type: String },
    Variety: { type: String },
    Grade: { type: String },
    Min_x0020_Price: { type: String },
    Max_x0020_Price: { type: String },
    Modal_x0020_Price: { type: Number },
    Arrival_Date: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("MarketData", MarketDataSchema);
