"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = void 0;
const user_1 = require("./user");
const task_1 = require("./task");
function setupAssociations() {
    user_1.User.hasMany(task_1.Task, { foreignKey: 'userId', sourceKey: 'uuid' });
    task_1.Task.belongsTo(user_1.User, { foreignKey: 'userId', targetKey: 'uuid' });
}
exports.setupAssociations = setupAssociations;
