const Sequelize = require('sequelize')
const db = require('../db')

const Budget = db.define('budget', {
  month: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  allocation: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    defaultValue: 0.0,
    get() {
      // Workaround until sequelize issue #8019 is fixed
      const value = this.getDataValue('allocation')
      return parseFloat(value)
    }
  },
  type: {
    type: Sequelize.ENUM('Annual', 'Monthly', 'Hourly'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Budget
