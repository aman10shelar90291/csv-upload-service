import { json, request } from "express";
import UserModel from "../schema/user.schema.js";
import csv from "csvtojson";

class UserService {
  static async saveUser(req) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("this is workiggggggg tillllll hererrererre");
        let body = req.body;
        if (body && body.name) {
          console.log("this is insideee ifffff conditttts");
          const userData = new UserModel(req.body);
          await userData.save(body);
          resolve({
            messageCode: 201,
            success: true,
            message: "workinggg herer",
          });
        }
      } catch (err) {
        console.log("thisi s insdieeee errrr", err);
        reject({
          messageCode: 500,
          success: false,
          message: "server error",
        });
      }
    });
  }

  static async saveCsv(req) {
    return new Promise((resolve, reject) => {
      try {
        csv()
          .fromString(req.files.csv.data.toString())
          .then(async (jsonData) => {
            if (jsonData.length > 0) {
              const userList = jsonData.map((item) => {
                const {
                  firstName,
                  lastName,
                  addressLine1,
                  addressLine2,
                  city,
                  state,
                  ...rest
                } = item;
                const name = { firstName, lastName };
                const address = { addressLine1, addressLine2, city, state };
                return { ...rest, name, address };
              });
              await UserModel.insertMany(userList);
              resolve({
                messageCode: 201,
                success: true,
                message: "users saved.....",
              });
            }
          });
      } catch (err) {
        reject({
          messageCode: 500,
          success: false,
          message: "server error",
        });
      }
    });
  }

  static async generateReport() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await UserModel.aggregate([
          {
            $group: {
              _id: null,
              totalDocuments: { $sum: 1 },
              under20: {
                $sum: { $cond: [{ $lt: ["$age", 20] }, 1, 0] },
              },
              between20and400: {
                $sum: {
                  $cond: [
                    { $and: [{ $gte: ["$age", 20] }, { $lte: ["$age", 40] }] },
                    1,
                    0,
                  ],
                },
              },
              between40and60: {
                $sum: {
                  $cond: [
                    { $and: [{ $gte: ["$age", 40] }, { $lte: ["$age", 60] }] },
                    1,
                    0,
                  ],
                },
              },
              above60:{
                $sum:{ $cond: [{$gte : ["$age", 60]}, 1, 0]}
              }
            },
          },
          {
            $project: {
              _id: 0,
              totalDocuments: 1,
              under20Percentage: {
                $multiply: [{ $divide: ["$under20", "$totalDocuments"] }, 100],
              },
              between40and60Percentage: {
                $multiply: [
                  { $divide: ["$between40and60", "$totalDocuments"] },
                  100,
                ],
              },
              between20and40Percentage: {
                $multiply: [
                  { $divide: ["$between20and400", "$totalDocuments"] },
                  100,
                ],
              },
              above60: {
                $multiply: [
                  { $divide: ["$above60", "$totalDocuments"] },
                  100,
                ],
              }
            },
          },
        ]);
        resolve({
          messageCode: 200,
          success: true,
          data: result,
        });
      } catch (err) {
        console.log("thsi ss ss errrr", err);
        reject({
          messageCode: 500,
          success: false,
          message: "server error",
        });
      }
    });
  }
}

export default UserService;
