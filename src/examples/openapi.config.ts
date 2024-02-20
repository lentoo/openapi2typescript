// const { generateService } = require('@yourenz/umijs-openapi')
const mri = require('mri')
const { generateService } = require('../index')
const path = require('path')

/**
 * 增加一条node命令：yarn run api --env ${env} --server ${server} --controller ${controller}
 * package.json scripts 增加一条：ts-node --skip-project openapi.config.ts
 */

function formatName(name) {
  return name.replace(/-(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
const cmdArgv = mri(process.argv.slice(2))
const isCmd = !!cmdArgv.env

type APIServices =
  | 'scp-quality-web'
  | 'scp-manufacture-web'
  | 'scp-product-design-web'
  | 'scp-garment-engineering-web'
  | 'scp-integration-web'
  | 'scp-dashboard-web'
  | 'scp-warehouse-transportation-web'
  | 'scp-settlement-web'
  | 'scp-material-web'
  | 'scp-brand-demand-web'
  | 'scp-warehouse-transportation-web'
  | 'scp-saas-web'
// TIPS: 在此处添加需要的Controller
const includeController: string[] = []

const pullServer: APIServices[] = isCmd ? [cmdArgv.server] : ['scp-quality-web']

const projectNameMap = {
  'scp-saas-web': 'common',
  'scp-quality-web': 'quality',
  'scp-settlement-web': 'settlement-web',
  'scp-garment-engineering-web': 'garment-engineering',
  'scp-product-design-web': 'product-design',
  'scp-material-web': 'material',
  'scp-warehouse-transportation-web': 'warehouse-transportation',
  'scp-manufacture-web': 'manufacture-web',
  'scp-brand-demand-web': 'brand-demand',
  'scp-dashboard-web': 'dashboard'
}

const swaggerConfig = pullServer.map((row) => {
  return {
    schemaPath: `http://gateway.scp-${isCmd ? cmdArgv.env : 'dev'}.ur.com.cn/${row}/v3/api-docs`,
    projectName: projectNameMap[row],
    include: includeController
  }
})

swaggerConfig.forEach((config) => {
  generateService({
    serversPath: './src/api',
    tags: isCmd ? [cmdArgv.controller] : [], // 输入要拉取的controller tag、如：refund-supply-head-web-controller
    clear: false,
    requestLibPath: '@/utils/request',
    ...config,
    hook: {
      customFunctionName(data) {
        const method = data.method
        const meta = data.path.replace('/resource', '')
        const metaArr = meta
          .substr(1)
          .split('/')
          .filter((v) => !!v)
          .map((v, i) => {
            const params = v.match(/^\{(.*?)\}$/)
            const format = formatName(v)
            const name = params ? `$${params[1]}` : i !== 0 ? `${format[0].toUpperCase()}${format.substr(1)}` : format
            return name
          })
        return `${method.toUpperCase()}${metaArr.join('')}`
      }
    }
  })
})
