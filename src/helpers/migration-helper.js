import _ from 'lodash';
import helpers from './index';

const Sequelize = helpers.generic.getSequelize();

module.exports = {
  getTableName(modelName) {
    return Sequelize.Utils.pluralize(modelName);
  },

  generateTableCreationFileContent(args) {
    const extension = (args.module === 'commonjs' ? 'c' : 'm') + args.extension;
    return helpers.template.render('migrations/create-table.' + extension, {
      tableName: this.getTableName(args.name),
      attributes: helpers.model.transformAttributes(args.attributes),
      createdAt: args.underscored ? 'created_at' : 'createdAt',
      updatedAt: args.underscored ? 'updated_at' : 'updatedAt',
    });
  },

  generateMigrationName(args) {
    return _.trimStart(_.kebabCase('create-' + args.name), '-');
  },

  generateTableCreationFile(args) {
    const migrationName = this.generateMigrationName(args);
    const migrationPath = helpers.path.getMigrationPath(migrationName);

    helpers.asset.write(
      migrationPath,
      this.generateTableCreationFileContent(args)
    );
  },
};
