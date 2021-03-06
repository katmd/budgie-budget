'use strict'

const db = require('../server/db')
const {User, Budget, Category} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await User.bulkCreate([
    {email: 'cody@email.com', password: '123'},
    {email: 'murphy@email.com', password: '123'}
  ])

  const categories = await Category.bulkCreate([
    {name: 'Salary', type: 'Income'},
    {name: 'Shopping', type: 'Expense'},
    {name: 'Transport', type: 'Expense'},
    {name: 'Car Loan', type: 'Debt'}
  ])

  const budgets = await Budget.bulkCreate([
    {
      userId: 1,
      categoryId: 1,
      month: 4,
      year: 2020,
      allocation: 72000,
      type: 'Annual'
    },
    {
      userId: 1,
      categoryId: 2,
      month: 4,
      year: 2020,
      allocation: 200,
      type: 'Monthly'
    },
    {
      userId: 1,
      categoryId: 3,
      month: 4,
      year: 2020,
      allocation: 50,
      type: 'Monthly'
    },
    {
      userId: 1,
      categoryId: 4,
      month: 4,
      year: 2020,
      allocation: 150,
      type: 'Monthly'
    },
    {
      userId: 1,
      categoryId: 1,
      month: 5,
      year: 2020,
      allocation: 75000,
      type: 'Annual'
    },
    {
      userId: 1,
      categoryId: 2,
      month: 5,
      year: 2020,
      allocation: 150,
      type: 'Monthly'
    },
    {
      userId: 1,
      categoryId: 3,
      month: 5,
      year: 2020,
      allocation: 50,
      type: 'Monthly'
    },
    {
      userId: 1,
      categoryId: 4,
      month: 5,
      year: 2020,
      allocation: 150,
      type: 'Monthly'
    },
    {
      userId: 2,
      categoryId: 1,
      month: 4,
      year: 2020,
      allocation: 3500,
      type: 'Monthly'
    },
    {
      userId: 2,
      categoryId: 2,
      month: 4,
      year: 2020,
      allocation: 250,
      type: 'Monthly'
    },
    {
      userId: 2,
      categoryId: 4,
      month: 4,
      year: 2020,
      allocation: 200,
      type: 'Monthly'
    }
  ])

  console.log(
    `seeded ${users.length} users, ${categories.length} categories, and ${
      budgets.length
    } budgets`
  )
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
