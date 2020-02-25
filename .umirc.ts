import { IConfig } from 'umi-types'

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  urlLoaderExcludes: [/.svg$/],
  chainWebpack(config) {
    config.module
      .rule('svg')
      .test(/.svg(\?v=\d+.\d+.\d+)?$/)
      .use([
        {
          loader: 'babel-loader'
        },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
            icon: true
          }
        }
      ])
      .loader(require.resolve('@svgr/webpack'))
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'bsm_web_1.0',
        dll: false,

        routes: {
          exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//, /routes\//]
        }
      }
    ]
  ],
  proxy: {
    '/api/': {
      // target: 'http://192.168.2.54:8899',
      // target: 'http://192.168.2.93:8898',
      target: 'http://211.83.159.45:5203',
      changeOrigin: true,
      pathRewrite: { '^/api/': '' }
    }
  }
}

export default config
