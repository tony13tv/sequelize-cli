import process from 'process';
import { _baseOptions, _underscoreOption } from '../core/yargs';

import helpers from '../helpers';
import fs from 'fs';
import colors from 'picocolors';

exports.builder = (yargs) =>
  _underscoreOption(
    _baseOptions(yargs).option('name', {
      describe: 'Defines the name of the migration',
      type: 'string',
      demandOption: true,
    }).option('extension', {
      describe: 'The extension to use.',
      type: 'string',
      default: 'js',
      choices: ['js', 'ts']
    }).option('module', {
      describe: 'The package.json type.',
      type: 'string',
      default: 'module',
      choices: ['commonjs', 'module']
    })
  ).argv;

exports.handler = function (args) {
  helpers.init.createMigrationsFolder();

  const extension = (args.module === 'commonjs' ? 'c' : 'm') + args.extension;

  fs.writeFileSync(
    helpers.path.getMigrationPath(args.name),
    helpers.template.render(
      'migrations/skeleton.' + extension,
      {},
      {
        beautify: false,
      }
    )
  );

  helpers.view.log(
    'New migration was created at',
    colors.blueBright(helpers.path.getMigrationPath(args.name)),
    '.'
  );

  process.exit(0);
};
