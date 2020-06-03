const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const {User, Budget, Category} = require('../db/models')

describe('Budget routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  let testUsers = [
    {
      email: 'savvy_saver@budget.com'
    },
    {
      email: 'buck@budget.com'
    }
  ]

  let testCategories = [
    {name: 'Gas', type: 'Expense'},
    {name: 'Electricity', type: 'Expense'},
    {name: 'Health', type: 'Expense'}
  ]

  let testBudgets = {
    firstUserGas: {
      month: 4,
      year: 2020,
      allocation: 200,
      type: 'Monthly'
    },
    firstUserElectricity: {
      month: 4,
      year: 2020,
      allocation: 100,
      type: 'Monthly'
    },
    secondUserGas: {
      month: 4,
      year: 2020,
      allocation: 150,
      type: 'Monthly'
    }
  }

  describe('/api/budget/', () => {
    beforeEach(async () => {
      await User.bulkCreate(testUsers)
        .then(async () => {
          await Category.bulkCreate(testCategories)
        })
        .then(async () => {
          let firstUser = await User.findByPk(1)
          let secondUser = await User.findByPk(2)
          let gasCategory = await Category.findOne({where: {name: 'Gas'}})
          await Budget.create({
            ...testBudgets.firstUserGas,
            categoryId: gasCategory.id,
            userId: firstUser.id
          })
          await Budget.create({
            ...testBudgets.secondUserGas,
            categoryId: gasCategory.id,
            userId: secondUser.id
          })

          let electricityCategory = await Category.findOne({
            where: {name: 'Electricity'}
          })
          await Budget.create({
            ...testBudgets.firstUserElectricity,
            categoryId: electricityCategory.id,
            userId: firstUser.id
          })
        })
        .then(() => {
          console.log('Completed populating test data')
        })
    })

    it('GET /api/budget/:userId should retrieve all budget items associated with first created user', async () => {
      const reqBody = {date: '2020-05-01T04:00:00.000Z'}
      let getResponse = await request(app)
        .get('/api/budget/1')
        .set('content-type', 'application/json')
        .send(reqBody)
        .expect(200)
      expect(getResponse.body).to.be.an('array')
      expect(getResponse.body.length).to.equal(2)
      expect(getResponse.body[0].category.name).to.equal('Gas')
      expect(getResponse.body[0].allocation).to.equal(200)
      expect(getResponse.body[0].type).to.equal('Monthly')
      expect(getResponse.body[1].category.name).to.equal('Electricity')
      expect(getResponse.body[1].allocation).to.equal(100)
      expect(getResponse.body[1].type).to.equal('Monthly')
    })

    it('GET /api/budget/:userId should retrieve all budget items associated with second created user', async () => {
      const reqBody = {date: '2020-05-01T04:00:00.000Z'}
      let getResponse = await request(app)
        .get('/api/budget/2')
        .set('content-type', 'application/json')
        .send(reqBody)
        .expect(200)
      expect(getResponse.body).to.be.an('array')
      expect(getResponse.body.length).to.equal(1)
      expect(getResponse.body[0].category.name).to.equal('Gas')
      expect(getResponse.body[0].type).to.equal('Monthly')
    })

    it('POST /api/budget/add/:userId should post a budget item and add a new category', async () => {
      const reqBody = {
        date: '2020-05-01T04:00:00.000Z',
        items: [
          {
            allocation: 100,
            allocationType: 'Monthly',
            categoryName: 'Shopping',
            categoryType: 'Expense'
          }
        ]
      }
      let postResponse = await request(app)
        .post('/api/budget/add/1')
        .set('content-type', 'application/json')
        .send(reqBody)
        .expect(201)
      expect(postResponse.body).to.be.an('object')
      expect(postResponse.text).to.equal('Created')

      let postedBudgetItem = await Budget.findOne({
        include: [
          {
            model: Category,
            where: {
              name: 'Shopping',
              type: 'Expense'
            }
          }
        ]
      })
      expect(postedBudgetItem.category.name).to.equal('Shopping')
      expect(postedBudgetItem.month).to.equal(4)
      expect(postedBudgetItem.year).to.equal(2020)
      expect(postedBudgetItem.allocation).to.equal(100)
      expect(postedBudgetItem.type).to.equal('Monthly')

      let categories = await Category.findAll()
      expect(categories.length).to.equal(4)
      let postedCategory = await Category.findAll({
        limit: 1,
        order: [['id', 'DESC']]
      })
      expect(postedCategory[0].name).to.equal('Shopping')
    })

    it('POST /api/budget/add/:userId should capitalize spaced words in the category name', async () => {
      const reqBody = {
        date: '2020-05-01T04:00:00.000Z',
        items: [
          {
            allocation: 100,
            allocationType: 'Monthly',
            categoryName: 'home improvement',
            categoryType: 'Expense'
          }
        ]
      }
      let postResponse = await request(app)
        .post('/api/budget/add/1')
        .set('content-type', 'application/json')
        .send(reqBody)
        .expect(201)
      expect(postResponse.body).to.be.an('object')
      expect(postResponse.text).to.equal('Created')

      let postedBudgetItem = await Budget.findOne({
        include: [
          {
            model: Category,
            where: {
              name: 'Home Improvement',
              type: 'Expense'
            }
          }
        ]
      })
      expect(postedBudgetItem.category.name).to.equal('Home Improvement')
    })

    it('POST /api/budget/add/:userId should not add a new category record if a category with the same name and type exists', async () => {
      const reqBody = {
        date: '2020-05-01T04:00:00.000Z',
        items: [
          {
            allocation: 100,
            allocationType: 'Monthly',
            categoryName: 'Health',
            categoryType: 'Expense'
          }
        ]
      }
      let postResponse = await request(app)
        .post('/api/budget/add/1')
        .set('content-type', 'application/json')
        .send(reqBody)
        .expect(201)
      expect(postResponse.body).to.be.an('object')
      expect(postResponse.text).to.equal('Created')

      let postedBudgetItem = await Budget.findOne({
        include: [
          {
            model: Category,
            where: {
              name: 'Health'
            }
          }
        ]
      })
      expect(postedBudgetItem.category.name).to.equal('Health')
      expect(postedBudgetItem.month).to.equal(4)
      expect(postedBudgetItem.year).to.equal(2020)
      expect(postedBudgetItem.allocation).to.equal(100)
      expect(postedBudgetItem.type).to.equal('Monthly')

      let categories = await Category.findAll()
      expect(categories.length).to.equal(3)
    })
  })
})
