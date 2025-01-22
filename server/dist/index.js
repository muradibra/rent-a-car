"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
require("./config/db");
require("./config/auth-strategy");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const rent_1 = __importDefault(require("./routes/rent"));
const review_1 = __importDefault(require("./routes/review"));
const favorite_1 = __importDefault(require("./routes/favorite"));
const category_1 = __importDefault(require("./routes/category"));
const location_1 = __importDefault(require("./routes/location"));
const reservation_1 = __importDefault(require("./routes/reservation"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/public", express_1.default.static("./public"));
app.use("/auth", auth_1.default);
app.use("/users", user_1.default);
app.use("/locations", location_1.default);
app.use("/categories", category_1.default);
app.use("/rents", rent_1.default);
app.use("/reservations", reservation_1.default);
app.use("/reviews", review_1.default);
app.use("/favorites", favorite_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
