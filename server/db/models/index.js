const User = require('./user')
const Budget = require('./budget')
const Category = require('./category')

// User.hasMany(Budget)
// Budget.belongsTo(User)

// Budget.belongsToMany(Category, {through: 'budgetCategory'})
// Category.belongsToMany(Budget, {through: 'budgetCategory'})

// User.hasMany(Category)
// Category.belongsTo(User)

// User.belongsToMany(Category, {through: 'userBudgetCategory'})
// User.belongsToMany(Budget, {through: 'userBudgetCategory'})

// Category.belongsToMany(User, {through: 'userBudgetCategory'})
// Category.belongsToMany(Budget, {through: 'userBudgetCategory'})

// Budget.belongsToMany(User, {through: 'userBudgetCategory'})
// Budget.belongsToMany(Category, {through: 'userBudgetCategory'})

// User.belongsToMany(Category, {through: Budget})
// Category.belongsToMany(User, {through: Budget})
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
