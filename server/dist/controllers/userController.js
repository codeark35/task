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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsersAll = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = require("../models/user");
const getUsersAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_1.User.findAll({
            attributes: [
                "uuid",
                "name",
                "last_name",
                "email",
                "role",
                [
                    sequelize_typescript_1.Sequelize.fn("date_format", sequelize_typescript_1.Sequelize.col("createdAt"), "%d-%m-%Y"),
                    "createdAt",
                ],
                "updatedAt",
            ],
        });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.getUsersAll = getUsersAll;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield user_1.User.findOne({
            attributes: [
                "uuid",
                "name",
                "last_name",
                "email",
                "role",
                [
                    sequelize_typescript_1.Sequelize.fn("date_format", sequelize_typescript_1.Sequelize.col("createdAt"), "%d-%m-%Y"),
                    "createdAt",
                ],
                "updatedAt",
            ],
            where: {
                uuid: req.params.uuid,
            },
        });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.getUser = getUser;
