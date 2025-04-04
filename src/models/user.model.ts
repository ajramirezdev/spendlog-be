import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function (this: any) {
        return this.provider === "local";
      },
    },
    provider: {
      type: String,
      required: true,
      default: "local",
      enum: ["local", "google", "discord", "github"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// exclude password from response
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("Users", userSchema);

export default User;
