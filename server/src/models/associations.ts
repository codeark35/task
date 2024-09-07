import { User } from './user';
import { Task } from './task';

export function setupAssociations() {
    User.hasMany(Task, { foreignKey: 'userId', sourceKey: 'uuid' });
    Task.belongsTo(User, { foreignKey: 'userId', targetKey: 'uuid' });
}