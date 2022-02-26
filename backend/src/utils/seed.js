const { faker } = require("@faker-js/faker");

async function seedArticlesCollection() {
  const numberOfRecordsToCreate = 207;

  for (let i = 0; i < numberOfRecordsToCreate; i++) {
    await strapi.api.article.services.article.create({
      data: {
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
      },
    });
  }

  console.log(`Added ${numberOfRecordsToCreate} records`);
}

module.exports = { seedArticlesCollection };
