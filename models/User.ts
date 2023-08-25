import { compare, genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Model, Schema, model } from "mongoose";
import { JWT_LIFETIME, JWT_SECRET } from "../config/constant";

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  address?: string;
  contactNumber?: string;
  profilePic?: string;
}

export interface IUserMethods {
  createJWT: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  address: {
    type: String,
    maxlength: 100,
  },
  contactNumber: {
    type: String,
    maxlength: 50,
  },
  profilePic: {
    type: String,
  },
});

UserSchema.pre("save", async function () {
  const salt = await genSalt(10);
  const hashPassword = await hash(this.password, salt);
  this.password = hashPassword;
});

UserSchema.methods.createJWT = function () {
  return sign(
    {
      id: this._id,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await compare(password, this.password);
  return isMatch;
};

export const User = model<IUser, UserModel>("User", UserSchema);
