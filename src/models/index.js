module.exports = createModels;
function createModels(sequelize) {
  let models = {
    User: sequelize.import('./User')
  };
  return models;
}
