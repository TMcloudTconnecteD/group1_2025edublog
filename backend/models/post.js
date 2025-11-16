import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member", // this MUST match your userModel.js export name
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
