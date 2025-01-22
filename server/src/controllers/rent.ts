import { Request, Response } from "express";
import Category from "../mongoose/schemas/category";
import Location from "../mongoose/schemas/location";
import { deleteFiles, deleteFilesByPaths } from "../utils/file";
import Rent from "../mongoose/schemas/rent";
import { RootFilterQuery } from "mongoose";
import Reservation from "../mongoose/schemas/reservation";

const getAll = async (req: Request, res: Response) => {
  try {
    const {
      search,
      dropOffLocation,
      pickUpLocation,
      minPrice,
      maxPrice,
      categories,
      capacities,
      skip = 0,
      take = 10,
      showInRecommendation,
    } = req.matchedData;

    const filter: RootFilterQuery<any> = {
      $or: [],
      $and: [],
    };

    if (showInRecommendation) {
      filter.$and?.push({
        showInRecommendation: showInRecommendation === "true",
      });
    }

    if (search) {
      filter.$or?.push({
        title: { $regex: search as string, $options: "i" },
      });
      filter.$or?.push({
        description: { $regex: search as string, $options: "i" },
      });
    }

    if (dropOffLocation) {
      filter.$and?.push({
        dropOffLocations: {
          $in: [dropOffLocation],
        },
      });
    }

    if (pickUpLocation) {
      filter.$and?.push({
        pickUpLocations: {
          $in: [pickUpLocation],
        },
      });
    }

    if (capacities?.length) {
      filter.$and?.push({
        capacity: { $in: capacities },
      });
    }

    if (categories?.length) {
      filter.$and?.push({
        category: { $in: categories },
      });
    }

    if (minPrice) {
      filter.$and?.push({
        price: { $gte: minPrice },
      });
    }

    if (maxPrice) {
      filter.$and?.push({
        price: { $lte: maxPrice },
      });
    }

    const rents = await Rent.find(filter)
      .populate(["category", "pickUpLocations", "dropOffLocations"])
      .skip(+skip)
      .limit(+take);

    const count = await Rent.countDocuments(filter);

    res.status(200).json({
      message: "Rents fetched successfully!",
      skip: +skip,
      take: +take,
      count,
      items: rents.map((rent) => ({
        ...rent.toObject(),
        imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`),
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getPopular = async (req: Request, res: Response) => {
  try {
    const popularRents = await Reservation.aggregate([
      {
        $group: {
          _id: "$rent",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 4,
      },
    ]);

    const topRents = await Rent.find({
      _id: { $in: popularRents.map((r) => r._id) },
    });

    res.status(200).json({
      message: "Popular rents fetched successfully!",
      items: topRents.map((rent) => ({
        ...rent.toObject(),
        imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`),
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rent = await Rent.findById(id).populate([
      "category",
      "pickUpLocations",
      "dropOffLocations",
    ]);

    if (!rent) {
      res.status(404).json({ message: "Rent not found!" });
      return;
    }

    res.status(200).json({
      message: "Rent fetched successfully!",
      item: {
        ...rent.toObject(),
        imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      fuel,
      gear,
      capacity,
      price,
      discountPrice,
      category,
      pickUpLocations,
      dropOffLocations,
      showInRecommendation,
    } = req.matchedData;

    const promises = [
      Category.findById(category),
      Location.countDocuments({ _id: { $in: pickUpLocations } }),
      Location.countDocuments({ _id: { $in: dropOffLocations } }),
    ];

    const [
      categoryExists,
      pickUpLocationsExistsCount,
      dropOffLocationsExistsCount,
    ] = await Promise.all(promises);

    if (!categoryExists) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Category not found!" });
      return;
    }

    if (pickUpLocations.length !== pickUpLocationsExistsCount) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Pick up location not found!" });
      return;
    }

    if (dropOffLocations.length !== dropOffLocationsExistsCount) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Drop off location not found!" });
      return;
    }

    const rent = await Rent.create({
      title,
      description,
      fuel,
      gear,
      capacity,
      price,
      discountPrice,
      category,
      pickUpLocations,
      dropOffLocations,
      showInRecommendation: showInRecommendation === "true",
      imageUrls: (req.files as Express.Multer.File[]).map((file) =>
        file.path.replace(/\\/g, "/")
      ),
    });

    if (typeof categoryExists !== "number") {
      categoryExists.rents.push(rent._id);
      await categoryExists.save();
    }

    res.status(201).json({ message: "Rent created successfully", item: rent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      fuel,
      gear,
      capacity,
      price,
      discountPrice,
      category,
      pickUpLocations,
      dropOffLocations,
      showInRecommendation,
    } = req.matchedData;

    const rent = await Rent.findById(id).populate([
      "category",
      "pickUpLocations",
      "dropOffLocations",
    ]);

    if (!rent) {
      res.status(404).json({ message: "Rent not found!" });
      return;
    }

    const promises = [
      Category.findById(category),
      Location.countDocuments({ _id: { $in: pickUpLocations } }),
      Location.countDocuments({ _id: { $in: dropOffLocations } }),
    ];

    const [
      categoryExists,
      pickUpLocationsExistsCount,
      dropOffLocationsExistsCount,
    ] = await Promise.all(promises);

    if (!categoryExists) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Category not found!" });
      return;
    }

    if (pickUpLocations.length !== pickUpLocationsExistsCount) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Pick up location not found!" });
      return;
    }

    if (dropOffLocations.length !== dropOffLocationsExistsCount) {
      deleteFiles(req.files as Express.Multer.File[]);
      res.status(400).json({ message: "Drop off location not found!" });
      return;
    }

    rent.title = title;
    rent.description = description;
    rent.fuel = fuel;
    rent.gear = gear;
    rent.capacity = capacity;
    rent.price = price;
    rent.discountPrice = discountPrice;
    rent.pickUpLocations = pickUpLocations;
    rent.dropOffLocations = dropOffLocations;
    rent.showInRecommendation = showInRecommendation === "true";

    if (req.files?.length) {
      deleteFilesByPaths(rent.imageUrls);
      rent.imageUrls = (req.files as Express.Multer.File[]).map((file) =>
        file.path.replace(/\\/g, "/")
      );
    }

    if (
      rent.category.toString() !== category &&
      typeof categoryExists !== "number"
    ) {
      categoryExists.rents.push(rent._id);
      await categoryExists.save();
      await Category.findByIdAndUpdate(rent.category, {
        $pull: { rents: rent._id },
      });
      rent.category = category;
    }

    await rent.save();

    res.status(200).json({ message: "Rent updated successfully.", item: rent });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const rent = await Rent.findByIdAndDelete(id);

    if (!rent) {
      res.status(404).json({ message: "Rent not found!" });
      return;
    }

    deleteFilesByPaths(rent.imageUrls);

    res.status(200).json({ message: "Rent deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const rentController = {
  getAll,
  getPopular,
  getById,
  create,
  edit,
  remove,
};

export default rentController;
