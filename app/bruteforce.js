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

const checkAllBruteForce = async () => {
  console.time('bruteforce');
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
        return result.filter((r) => r[4] !== true);
      })
      .then((result) => {
        console.timeEnd('bruteforce');
        console.log(result);
      })
      .catch(() => console.log('[error]'));
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

function sleep(ms) {
  return new Promise((resolve) => {
    // console.log('sleep...');
    setTimeout(resolve, ms);
  });
}

const bruteForce = () => {
  run()
      .then(async () => {
        for (let index = 1; index < 100; index++) {
          await sleep(Math.floor(Math.random() * 1000) + 1000);
          await checkAllBruteForce().catch(() => console.log('[error]'));
        }
      })
      .then(() => process.exit(0))
      .catch((error) => console.error(error));
};

bruteForce();
