import mongoose from "mongoose";

const balanceSchema = mongoose.Schema({
  totalBalance: {
    type: Number,
    default: 0,
  },
  totalOwedByYou: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: {
        type: Number,
      },
    },
  ],
  totalOwedToYou: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: {
        type: Number,
      },
    },
  ],
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },

    balance: balanceSchema,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
