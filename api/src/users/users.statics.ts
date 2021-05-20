import User from '../models/User';

export const getByUserId = async (userId: string) =>
  await User.findById(userId);

export const getByUsername = async (username: string, password: string) =>
  await User.findOne({ username: { $eq: username } });
