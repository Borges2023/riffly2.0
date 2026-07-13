import { db } from "../connect.js";

const collection = () => db.collection("users");

export const adminRepository = {
  async findUsers() {
    return collection().find({}).toArray();
  },
  async updateUserPlan(userId, plan) {
    return collection().updateOne(
      { _id: userId },
      { $set: { plan, updatedAt: new Date(), updatedBy: "admin" } }
    );
  },
  async upgradeAllUsers() {
    return collection().updateMany(
      {},
      { $set: { plan: "premium", upgradedAt: new Date(), upgradedBy: "admin" } }
    );
  },
  async promoteUserByEmail(email) {
    return collection().updateOne(
      { email },
      { $set: { plan: "premium", promotedAt: new Date(), promotedBy: "admin" } }
    );
  },
};
