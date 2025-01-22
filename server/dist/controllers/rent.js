"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("../mongoose/schemas/category"));
const location_1 = __importDefault(require("../mongoose/schemas/location"));
const file_1 = require("../utils/file");
const rent_1 = __importDefault(require("../mongoose/schemas/rent"));
const reservation_1 = __importDefault(require("../mongoose/schemas/reservation"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const { search, dropOffLocation, pickUpLocation, minPrice, maxPrice, categories, capacities, skip = 0, take = 10, showInRecommendation, } = req.matchedData;
        const filter = {
            $or: [],
            $and: [],
        };
        if (showInRecommendation) {
            (_a = filter.$and) === null || _a === void 0 ? void 0 : _a.push({
                showInRecommendation: showInRecommendation === "true",
            });
        }
        if (search) {
            (_b = filter.$or) === null || _b === void 0 ? void 0 : _b.push({
                title: { $regex: search, $options: "i" },
            });
            (_c = filter.$or) === null || _c === void 0 ? void 0 : _c.push({
                description: { $regex: search, $options: "i" },
            });
        }
        if (dropOffLocation) {
            (_d = filter.$and) === null || _d === void 0 ? void 0 : _d.push({
                dropOffLocations: {
                    $in: [dropOffLocation],
                },
            });
        }
        if (pickUpLocation) {
            (_e = filter.$and) === null || _e === void 0 ? void 0 : _e.push({
                pickUpLocations: {
                    $in: [pickUpLocation],
                },
            });
        }
        if (capacities === null || capacities === void 0 ? void 0 : capacities.length) {
            (_f = filter.$and) === null || _f === void 0 ? void 0 : _f.push({
                capacity: { $in: capacities },
            });
        }
        if (categories === null || categories === void 0 ? void 0 : categories.length) {
            (_g = filter.$and) === null || _g === void 0 ? void 0 : _g.push({
                category: { $in: categories },
            });
        }
        if (minPrice) {
            (_h = filter.$and) === null || _h === void 0 ? void 0 : _h.push({
                price: { $gte: minPrice },
            });
        }
        if (maxPrice) {
            (_j = filter.$and) === null || _j === void 0 ? void 0 : _j.push({
                price: { $lte: maxPrice },
            });
        }
        const rents = yield rent_1.default.find(filter)
            .populate(["category", "pickUpLocations", "dropOffLocations"])
            .skip(+skip)
            .limit(+take);
        const count = yield rent_1.default.countDocuments(filter);
        res.status(200).json({
            message: "Rents fetched successfully!",
            skip: +skip,
            take: +take,
            count,
            items: rents.map((rent) => (Object.assign(Object.assign({}, rent.toObject()), { imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`) }))),
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const getPopular = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularRents = yield reservation_1.default.aggregate([
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
        const topRents = yield rent_1.default.find({
            _id: { $in: popularRents.map((r) => r._id) },
        });
        res.status(200).json({
            message: "Popular rents fetched successfully!",
            items: topRents.map((rent) => (Object.assign(Object.assign({}, rent.toObject()), { imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`) }))),
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rent = yield rent_1.default.findById(id).populate([
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
            item: Object.assign(Object.assign({}, rent.toObject()), { imageUrls: rent.imageUrls.map((url) => `${process.env.BASE_URL}${url}`) }),
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, fuel, gear, capacity, price, discountPrice, category, pickUpLocations, dropOffLocations, showInRecommendation, } = req.matchedData;
        const promises = [
            category_1.default.findById(category),
            location_1.default.countDocuments({ _id: { $in: pickUpLocations } }),
            location_1.default.countDocuments({ _id: { $in: dropOffLocations } }),
        ];
        const [categoryExists, pickUpLocationsExistsCount, dropOffLocationsExistsCount,] = yield Promise.all(promises);
        if (!categoryExists) {
            (0, file_1.deleteFiles)(req.files);
            res.status(400).json({ message: "Category not found!" });
            return;
        }
        if (pickUpLocations.length !== pickUpLocationsExistsCount) {
            (0, file_1.deleteFiles)(req.files);
            res.status(400).json({ message: "Pick up location not found!" });
            return;
        }
        if (dropOffLocations.length !== dropOffLocationsExistsCount) {
            (0, file_1.deleteFiles)(req.files);
            res.status(400).json({ message: "Drop off location not found!" });
            return;
        }
        const rent = yield rent_1.default.create({
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
            imageUrls: req.files.map((file) => file.path.replace(/\\/g, "/")),
        });
        if (typeof categoryExists !== "number") {
            categoryExists.rents.push(rent._id);
            yield categoryExists.save();
        }
        res.status(201).json({ message: "Rent created successfully", item: rent });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, fuel, gear, capacity, price, discountPrice, category, pickUpLocations, dropOffLocations, showInRecommendation, } = req.matchedData;
        const rent = yield rent_1.default.findById(id).populate([
            "category",
            "pickUpLocations",
            "dropOffLocations",
        ]);
        if (!rent) {
            res.status(404).json({ message: "Rent not found!" });
            return;
        }
        const promises = [
            category_1.default.findById(category),
            location_1.default.countDocuments({ _id: { $in: pickUpLocations } }),
            location_1.default.countDocuments({ _id: { $in: dropOffLocations } }),
        ];
        const [categoryExists, pickUpLocationsExistsCount, dropOffLocationsExistsCount,] = yield Promise.all(promises);
        if (!categoryExists) {
            (0, file_1.deleteFiles)(req.files);
            res.status(400).json({ message: "Category not found!" });
            return;
        }
        if (pickUpLocations.length !== pickUpLocationsExistsCount) {
            (0, file_1.deleteFiles)(req.files);
            res.status(400).json({ message: "Pick up location not found!" });
            return;
        }
        if (dropOffLocations.length !== dropOffLocationsExistsCount) {
            (0, file_1.deleteFiles)(req.files);
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
        if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) {
            (0, file_1.deleteFilesByPaths)(rent.imageUrls);
            rent.imageUrls = req.files.map((file) => file.path.replace(/\\/g, "/"));
        }
        if (rent.category.toString() !== category &&
            typeof categoryExists !== "number") {
            categoryExists.rents.push(rent._id);
            yield categoryExists.save();
            yield category_1.default.findByIdAndUpdate(rent.category, {
                $pull: { rents: rent._id },
            });
            rent.category = category;
        }
        yield rent.save();
        res.status(200).json({ message: "Rent updated successfully.", item: rent });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const rent = yield rent_1.default.findByIdAndDelete(id);
        if (!rent) {
            res.status(404).json({ message: "Rent not found!" });
            return;
        }
        (0, file_1.deleteFilesByPaths)(rent.imageUrls);
        res.status(200).json({ message: "Rent deleted successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const rentController = {
    getAll,
    getPopular,
    getById,
    create,
    edit,
    remove,
};
exports.default = rentController;
