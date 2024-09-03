import { Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user";

export const getUsersAll = async (req: Request, res: Response) => {
/*   try {
    const response = await User.findAll({
      attributes: [
        "uuid",
        "name",
        "last_name",
        "email",
        "role",
        [
          Sequelize.fn("date_format", Sequelize.col("createdAt"), "%d-%m-%Y"),
          "createdAt",
        ],
        "updatedAt",
      ],
    });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  } */
};

export const getUser = async (req: Request, res: Response) => {
/*   try {
    const response = await User.findOne({
      attributes: [
        "uuid",
        "name",
        "last_name",
        "email",
        "role",
        [
          Sequelize.fn("date_format", Sequelize.col("createdAt"), "%d-%m-%Y"),
          "createdAt",
        ],
        "updatedAt",
      ],
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  } */
};

