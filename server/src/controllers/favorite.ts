import { Request, Response } from "express";
import User from "../mongoose/schemas/user";

const getAll = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    res.status(200).json({
      favorites: user?.favorites,
      message: "Favorites fetched",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const toggle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    let message = "";

    if (user?.favorites.includes(id)) {
      Array.from(user?.favorites).forEach((favorite, index) => {
        if (favorite === id) {
          user?.favorites.splice(index, 1);
          message = "Removed from favorites";
        }
      });
    } else {
      user?.favorites.push(id);
      message = "Added to favorites";
    }

    await User.findByIdAndUpdate(user?._id, { favorites: user?.favorites });

    res.json({ message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const favoriteController = {
  getAll,
  toggle,
};

export default favoriteController;
