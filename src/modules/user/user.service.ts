import { IUser, IUserDocument } from "./user.interface";
import UserModel from "./user.model";

export const createUser = async (user: IUser): Promise<IUserDocument> => {
  // Password is already hashed by the controller before calling createUser.
  // Do NOT hash again here — that was causing bcrypt.compare to always fail.
  const newUser = new UserModel(user);
  return newUser.save();
};

export const findUserByEmail = async (
  email: string,
): Promise<IUserDocument | null> => {
  // Must use .select("+password") because the model has select:false on password field
  return UserModel.findOne({ email }).select("+password");
};

export const findUserById = async (
  id: string,
): Promise<IUserDocument | null> => {
  return UserModel.findById(id);
};

export const getUserByEmail = async (
  email: string,
): Promise<Omit<IUserDocument, "password"> | null> => {
  return UserModel.findOne({ email }).select("-password");
};
