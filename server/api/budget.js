const router = require('express').Router()
const {User, Budget, Category} = require('../db/models')
module.exports = router

// Grab all details of a user's budget by month specified
router.get('/:userId', async (req, res, next) => {
  // date is received as an ISO string
  // i.e. const date = (new Date()).toISOString();
  const userId = req.params.userId
  const date = req.body.date
  const deserializedDate = new Date(date)
  const dateMonth = deserializedDate.getMonth()
  const dateYear = deserializedDate.getFullYear()
  try {
    const currentUser = await User.findByPk(userId)
    const budget = await currentUser.getBudgets({
      where: {
        month: dateMonth,
        year: dateYear
      },
      include: [{model: Category}],
      order: [['id', 'ASC']]
    })
    res.json(budget)
  } catch (err) {
    next(err)
  }
})

// Add new items to a user's budget
router.post('/add/:userId', async (req, res, next) => {
  // items are received as an array of item objects
  const userId = req.params.userId
  const date = req.body.date
  const deserializedDate = new Date(date)
  const dateMonth = deserializedDate.getMonth()
  const dateYear = deserializedDate.getFullYear()
  const items = req.body.items
  try {
    await items.forEach(async item => {
      await Category.findOrCreate({
        where: {
          name: item.categoryName,
          type: item.categoryType
        }
      }).then(async categoryProduced => {
        await Budget.create({
          month: dateMonth,
          year: dateYear,
          allocation: item.allocation,
          type: item.allocationType,
          categoryId: categoryProduced[0].id,
          userId: userId
        })
        res.sendStatus(201)
      })
    })
  } catch (err) {
    next(err)
  }
})

// Update an item in a user's budget
router.put('/update', async (req, res, next) => {
  // item is received as an object
  const item = req.body.item
  try {
    await Budget.update(
      {
        allocation: item.allocation,
        type: item.allocationType
      },
      {
        where: {
          id: item.id
        },
        returning: true,
        plain: true
      }
    ).then(updatedBudget => {
      res.status(200).send(updatedBudget[1].dataValues)
    })
  } catch (err) {
    next(err)
  }
})

// Delete an item in a user's budget
router.delete('/delete/:budgetId', async (req, res, next) => {
  const budgetId = req.params.budgetId
  try {
    const itemToRemove = await Budget.findByPk(budgetId)
    itemToRemove.destroy()
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
