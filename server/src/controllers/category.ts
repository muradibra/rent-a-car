import { Request, Response } from "express";
import Category from "../mongoose/schemas/category";
import Rent from "../mongoose/schemas/rent";

const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories fetched successfully!",
      // count: categories.length,
      items: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ message: "Category not found!" });
      return;
    }

    res.status(200).json({
      message: "Category fetched successfully!",
      item: category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.matchedData;

    const category = await Category.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!category) {
      res.status(404).json({ message: "Category not found!" });
      return;
    }

    res.status(200).json({
      message: "Category updated successfully!",
      item: category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { title } = req.matchedData;

    const category = await Category.create({ title });

    res.status(201).json({
      message: "Category created successfully",
      item: category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hasAnyRent = await Rent.findOne({
      category: id,
    });

    if (hasAnyRent) {
      res.status(400).json({ message: "Category is in use!" });
      return;
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ message: "Category not found!" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const categoryController = {
  getAll,
  create,
  update,
  getById,
  remove,
};

export default categoryController;
