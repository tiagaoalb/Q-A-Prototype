require('dotenv').config();

const Sequelize = require('sequelize');
// const Promise = require('bluebird');
// const bcrypt = Promise.promisifyAll(require('bcrypt'));
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AccountModel = require('./models/account.model');
const faker = require('faker');

const security = require('./core/core.security');

const KeyBuilder = security.keygen;
const HashBuilder = security.hashgen;
const passCheck = security.check;

const sequelize = new Sequelize({
  host: 'localhost',
  port: 5432,
  username: 'viviane',
  password: 'password',
  dialect: 'postgres',
  database: 'test',
  logging: false,
});

const Account = AccountModel(sequelize, Sequelize);

const checkAll = async () => {
  await Account.findAll({
    attributes: ['email', 'password', 'key1', 'key2'],
    raw: true,
  })
      .then((data) =>
        data.map((a) => [
          a.email,
          a.password,
          a.key1,
          a.key2,
          passCheck('password', a.key1, a.key2),
        ]),
      )
      .then((result) => {
        return result.filter((r) => r[4] === false);
      })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
};

const countAll = async () => {
  await Account.findAll({
    attributes: ['password', 'key1', 'key2'],
    raw: true,
  }).then((data) => console.log(data.length));
};

const build = async () => {
  await sequelize
      .sync({force: true})
      .then(() => {
        console.log('Connected...');
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
};

const run = async () => {
  await sequelize
      .sync({alter: true})
      .then(() => {
        console.log('Connected...');
      })
      .catch((error) => {
        console.log(error);
      });
};

const cleanUp = async () => {
  run()
      .then(async () => {
        await countAll().catch((error) => console.error(error));

        await Account.destroy({
          truncate: true,
        });
        await countAll().catch((error) => console.error(error));
      })
      .then(() => process.exit(0))
      .catch((error) => console.error(error));
};
const generate = () => {
  run()
      .then(async () => {
        console.time('build');
        await countAll().catch((error) => console.error(error));

        await seed(10)
            .then(() => console.timeEnd('build'))
            .catch((error) => console.error(error));

        await countAll().catch((error) => console.error(error));

        console.time('check');
        await checkAll()
            .then(() => console.timeEnd('check'))
            .catch((error) => console.error(error));

        await countAll().catch((error) => console.error(error));
      })
      .then(() => process.exit(0))
      .catch((error) => console.error(error));
};

const bruteForce = () => {
  run()
      .then(async () => {
        for (let index = 1; index < 10; index++) {
          await checkAllBruteForce().catch((error) => console.error(error));
        }
      })
      .then(() => process.exit(0))
      .catch((error) => console.error(error));
};

cleanUp();
