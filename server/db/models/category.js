const Sequelize = require('sequelize')
const db = require('../db')

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: Sequelize.ENUM('Income', 'Expense', 'Debt'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Category

/**
 * hooks
 */
const formatName = category => {
  let splitName = category.name.split(' ').map(word => {
    let upperFirstLetter = word[0].toUpperCase()
    let lowerLetters = word.slice(1).toLowerCase()
    return upperFirstLetter.concat(lowerLetters)
  })
  category.name = splitName.join(' ')
}

Category.beforeCreate(formatName)
