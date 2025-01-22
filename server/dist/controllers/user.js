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
const file_1 = require("../utils/file");
const bcrypt_1 = require("../utils/bcrypt");
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user === null || user === void 0 ? void 0 : user.avatar)
        user.avatar = `${process.env.BASE_URL}${user.avatar}`;
    res.json({ user });
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().select("-password -__v -resetPasswordToken -resetPasswordTokenExpires");
        res.json({
            messsage: "Users fetched successfully",
            users: users.map((user) => {
                if (user.avatar)
                    user.avatar = `${process.env.BASE_URL}${user.avatar}`;
                return user;
            }),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, username, email, password, avatar } = req.matchedData;
        const user = yield user_1.default.findById(id);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        if (name)
            user.name = name;
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (password)
            user.password = (0, bcrypt_1.hashPassword)(password);
        if (avatar === "delete") {
            if (user.avatar) {
                (0, file_1.deleteFilesByPaths)([user.avatar]);
                user.avatar = "";
            }
        }
        if (req.file) {
            if (user.avatar) {
                (0, file_1.deleteFilesByPaths)([user.avatar]);
            }
            user.avatar = req.file.path;
        }
        yield user.save();
        res.json({ success: true, message: "User updated successfully", user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user._id;
        const user = yield user_1.default.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        if (user.avatar) {
            (0, file_1.deleteFilesByPaths)([user.avatar]);
        }
        res.json({ success: true, message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const userController = {
    currentUser,
    getAll,
    update,
    remove,
};
exports.default = userController;
