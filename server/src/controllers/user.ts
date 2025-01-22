import User from "../mongoose/schemas/user";
import { Request, Response } from "express";
import { deleteFilesByPaths } from "../utils/file";
import { hashPassword } from "../utils/bcrypt";

const currentUser = async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.avatar) user.avatar = `${process.env.BASE_URL}${user.avatar}`;

  res.json({ user });
};

const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select(
      "-password -__v -resetPasswordToken -resetPasswordTokenExpires"
    );
    res.json({
      messsage: "Users fetched successfully",
      users: users.map((user) => {
        if (user.avatar) user.avatar = `${process.env.BASE_URL}${user.avatar}`;
        return user;
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, email, password, avatar } = req.matchedData;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = hashPassword(password);
    if (avatar === "delete") {
      if (user.avatar) {
        deleteFilesByPaths([user.avatar]);
        user.avatar = "";
      }
    }
    if (req.file) {
      if (user.avatar) {
        deleteFilesByPaths([user.avatar]);
      }
      user.avatar = req.file.path;
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.user!._id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    if (user.avatar) {
      deleteFilesByPaths([user.avatar]);
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const userController = {
  currentUser,
  getAll,
  update,
  remove,
};

export default userController;
