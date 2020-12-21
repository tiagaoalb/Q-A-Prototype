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

console.clear();

const Account = AccountModel(sequelize, Sequelize);

const seed = async (count = 10) => {
  for (let index = 0; index < count; index++) {
    const email = `${Math.floor(
        Math.random() * Math.random() * 1000,
    )}${index}_${faker.internet.email()}`;
    // const pass = faker.internet.password();
    const pass = 'password';

    const Key = KeyBuilder(email);
    // console.log(Key);

    const HashBase64 = HashBuilder(pass, Key);
    // const HashBase64 = Buffer.from(Hash, 'utf-8').toString('base64');

    // const isCheck = await passCheck(pass, HashBase64, `${'' + Key + ''}`);
    // console.log(isCheck);

    const account = await Account.create({
      email: email,
      username: email,
      password: pass,
      key1: HashBase64,
      key2: Key,
    }).catch((error) => console.error(error));
  }
};

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
        return result.filter((r) => r[4] === true);
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

const generate = () => {
  run()
      .then(async () => {
        await Account.destroy({
          truncate: true,
        });

        // await countAll().catch((error) => console.error(error));

        console.time('build');
        await seed(1000)
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

generate();
