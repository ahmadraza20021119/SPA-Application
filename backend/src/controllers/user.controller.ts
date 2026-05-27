import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -_id -__v');
    return res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { id, password, name, email, role } = req.body;

    if (!id || !password || !name || !email || !role) {
      return res.status(400).json({ error: 'All fields (id, password, name, email, role) are required.' });
    }

    const existingUser = await User.findOne({ id: { $regex: new RegExp(`^${id}$`, 'i') } });

    if (existingUser) {
      return res.status(409).json({ error: `User with ID '${id}' already exists.` });
    }

    const newUser = new User({ id, password, name, email, role });
    await newUser.save();

    const userObj = newUser.toObject();
    const { password: _, _id, __v, ...secureNewUser } = userObj as any;
    return res.status(201).json(secureNewUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, name, email, role } = req.body;

    const user = await User.findOne({ id: { $regex: new RegExp(`^${id}$`, 'i') } });

    if (!user) {
      return res.status(404).json({ error: `User with ID '${id}' not found.` });
    }

    if (password) user.password = password;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    const userObj = user.toObject();
    const { password: _, _id, __v, ...secureUpdatedUser } = userObj as any;
    return res.json(secureUpdatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (id.toLowerCase() === 'admin1') {
      return res.status(400).json({ error: 'Cannot delete the primary root Administrator account.' });
    }

    const deletedUser = await User.findOneAndDelete({ id: { $regex: new RegExp(`^${id}$`, 'i') } });

    if (!deletedUser) {
      return res.status(404).json({ error: `User with ID '${id}' not found.` });
    }

    return res.json({ message: `User with ID '${id}' has been successfully deleted.` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
