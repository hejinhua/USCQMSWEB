import fetch from 'dva/fetch'
import { Modal, notification } from 'antd'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '无法连接服务器。'
}
function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const errortext = codeMessage[response.status] || response.statusText
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
    duration: null
  })

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const headers = { ...options, headers: { clientID: sessionStorage.getItem('clientID') } }
  return fetch(url, headers)
    .then(checkStatus)
    .then(response => {
      let dis = response.headers.get('content-disposition')
      if (dis) {
        let strs = dis.split('filename=')
        //取消双引号
        let fileName = decodeURIComponent(strs[1].replace(/\"/g, ''))
        response.blob().then(blob => {
          let blobUrl = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          document.body.appendChild(a)
          a.href = blobUrl
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(blobUrl)
        })
      } else {
        return response
      }
    })
    .then(parseJSON)
    .then(data => {
      if (data.path) {
        sessionStorage.setItem('isAuthenticated', false)
        Modal.info({
          title: '提示',
          content: data.info,
          centered: true,
          onOk() {
            window.location.pathname = data.path
          }
        })
      } else {
        if (data.flag === false) {
          notification.error({
            message: data.info || '请求报错',
            duration: 0
          })
        } else {
          data.dataList = data.dataList || []
          return { data }
        }
      }
    })
    .catch(err => ({ err }))
}
