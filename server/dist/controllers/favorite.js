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
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        res.status(200).json({
            favorites: user === null || user === void 0 ? void 0 : user.favorites,
            message: "Favorites fetched",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const toggle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.user;
        let message = "";
        if (user === null || user === void 0 ? void 0 : user.favorites.includes(id)) {
            Array.from(user === null || user === void 0 ? void 0 : user.favorites).forEach((favorite, index) => {
                if (favorite === id) {
                    user === null || user === void 0 ? void 0 : user.favorites.splice(index, 1);
                    message = "Removed from favorites";
                }
            });
        }
        else {
            user === null || user === void 0 ? void 0 : user.favorites.push(id);
            message = "Added to favorites";
        }
        yield user_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, { favorites: user === null || user === void 0 ? void 0 : user.favorites });
        res.json({ message });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const favoriteController = {
    getAll,
    toggle,
};
exports.default = favoriteController;
