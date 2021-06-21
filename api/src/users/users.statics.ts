import { ObjectId } from 'mongodb';
import { AccessLevels } from '../protests/protests.service';
import User from './users.models';

// TODO: remove credentials from these queries
export const findUserById = async (userId: string) =>
  await User.findById(userId);

// TODO: remove credentials from these queries
export const findUserByUsername = async (username: string) =>
  await User.findOne({ username: { $eq: username } });

/**
 * Adds a new user.
 * @param username The user's username.
 * @param password The hashed version of the user's password.
 * @returns
 */
export const addUser = async (username: string, password: string) =>
  await User.findOneAndUpdate(
    { _id: new ObjectId() },
    {
      $set: { username, password },
    },
    { upsert: true, new: true }
  );
