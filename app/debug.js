const {Page, sequelize} = require('./models');

const seed = async (count = 10) => {
  await Page.destroy({
    truncate: true,
  });

  for (let index = 0; index < count; index++) {
    await Page.create({
      title: `Titulo ${index + 1}`,
      sub_title: `exemplo ${index + 1}`,
    }).catch((error) => console.error(error));
  }

  // await Page.findAll({
  //   attributes: ['id', 'uuid', 'title', 'sub_title'],
  //   raw: true,
  // })
  //     .then((result) => {
  //       return result.map((p) => [p.title]);
  //     })
  //     .then((result) => console.log(result.toString()));
};

console.time('page');
seed(10000)
    .then(() => console.timeEnd('page'))
    .then(() => process.exit(0));
