import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


FriendRequestSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);


const FriendRequestModel = mongoose.model(
  "FriendRequest",
  FriendRequestSchema
);

export default FriendRequestModel;
