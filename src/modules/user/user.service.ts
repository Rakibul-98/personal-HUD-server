import { IUser } from "./user.interface";
import UserModel, { IUserDocument } from "./user.model";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createUser = async (user: IUser): Promise<IUserDocument> => {
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  const newUser = new UserModel({ ...user, password: hashedPassword });
  return newUser.save();
};

export const findUserByEmail = async (
  email: string
): Promise<IUserDocument | null> => {
  return UserModel.findOne({ email });
};

export const findUserById = async (
  id: string
): Promise<IUserDocument | null> => {
  return UserModel.findById(id);
};

export const getUserByEmail = async (
  email: string
): Promise<Omit<IUserDocument, "password"> | null> => {
  return UserModel.findOne({ email }).select("-password");
};
