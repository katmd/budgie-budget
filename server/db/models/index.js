const User = require('./user')
const Budget = require('./budget')
const Category = require('./category')

Budget.belongsTo(User)
Budget.belongsTo(Category)
User.hasMany(Budget)
Category.hasMany(Budget)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Budget,
  Category
}
