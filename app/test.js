const {Account} = require('./models');

const security = require('./core/security');
const faker = require('faker');

const KeyBuilder = security.keygen;
const HashBuilder = security.hashgen;
const passCheck = security.check;

// const seed = async (count = 10) => {
//   for (let index = 0; index < count; index++) {
//     const email = `${Math.floor(
//         Math.random() * Math.random() * 1000,
//     )}${index}_${faker.internet.email()}`;
//     // const pass = faker.internet.password();
//     const pass = 'password';

//     const Key = KeyBuilder(email);
//     // console.log(Key);

//     const HashBase64 = HashBuilder(pass, Key);
//     // const HashBase64 = Buffer.from(Hash, 'utf-8').toString('base64');

//     // const isCheck = await passCheck(pass, HashBase64, `${'' + Key + ''}`);
//     // console.log(isCheck);

//     const account = await Account.create({
//       email: email,
//       username: email,
//       password: pass,
//       key1: HashBase64,
//       key2: Key,
//     }).catch((error) => console.error(error));
//   }
// };

// const checkAll = async () => {
//   await Account.findAll({
//     attributes: ['email', 'password', 'key1', 'key2'],
//     raw: true,
//   })
//       .then((data) =>
//         data.map((a) => [
//           a.email,
//           a.password,
//           a.key1,
//           a.key2,
//           passCheck('password', a.key1, a.key2),
//         ]),
//       )
//       .then((result) => {
//         return result.filter((r) => r[4] === true);
//       })
//       .then((result) => console.log(result))
//       .catch((error) => console.error(error));
// };

// const countAll = async () => {
//   await Account.findAll({
//     attributes: ['password', 'key1', 'key2'],
//     raw: true,
//   }).then((data) => console.log(data.length));
// };

// const test = () => {
//   db.forceSync()
//       .then(async () => {
//       // await Account.destroy({
//       //   truncate: true,
//       // });

//         await seed(10)
//             .then(() => console.timeEnd('build'))
//             .catch((error) => console.error(error));
//       })
//       .then(() => process.exit(0))
//       .catch((error) => console.error(error));
// };

// test();

const AccountSeed = async (count = 10) => {
  await Account.destroy({
    truncate: true,
  });

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

  await Account.findAll({
    attributes: ['uuid', 'email', 'password', 'key1', 'key2'],
    raw: true,
  }).then((result) => console.log(result));
};

console.time('account');
AccountSeed(10)
    .then(() => console.timeEnd('account'))
    .then(() => process.exit(0));
