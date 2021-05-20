import User from '../models/User';

export const getByUserId = async (userId: any) => await User.findById(userId);

export const getByUsername = async (username: string, password: string) =>
  await User.findOne({ username: { $eq: username } });
