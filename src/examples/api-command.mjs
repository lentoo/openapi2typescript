import inquirer from 'inquirer';
import { execSync } from 'node:child_process';
inquirer
  .prompt([
    {
      message: '从test还是dev拉取？',
      type: 'list',
      name: 'env',
      choices: ['dev', 'test'],
    },
    {
      message: '选择swagger服务',
      type: 'list',
      name: 'server',
      choices: [
        'scp-quality-web',
        'scp-manufacture-web',
        'scp-settlement-web',
        'scp-product-design-web',
        'scp-saas-web',
        'scp-garment-engineering-web',
        'scp-integration-web',
        'scp-dashboard-web',
        'scp-warehouse-transportation-web',
        'scp-material-web',
        'scp-brand-demand-web',
      ],
    },
    {
      message:
        '请输入 tag / controller ! (例如：quality-abnormity-order-web-controller)',
      type: 'input',
      name: 'controller',
    },
  ])
  .then((values) => {
    const cmd = `yarn run api --env ${values.env} --server ${values.server} --controller ${values.controller}`;
    execSync(cmd, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
  });
