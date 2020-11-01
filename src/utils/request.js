import Vue from 'vue'
import axios from 'axios'
import {
  Message
} from 'element-ui'
Vue.prototype.$http = axios
let baseUrl = 'http://localhost:8000/' // API_URL_PREFIX
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api.dubheee.cn/' // API_URL_PREFIX
}
// const baseUrl = 'http://localhost:8000/' // API_URL_PREFIX
const showErr = function (err) {
  try {
    Message.error({
      message: err
    })
  } catch (error) {
    console.error('Message Error - ', error)
  }
}

axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.error({
    message: '请求超时!'
  })
  return Promise.resolve(err)
})

/**
 * 处理报错的各种情况
 * 参数：err
 * 返回值：正确则返回 resolve
 * 失败 reject 错误信息
 */
axios.interceptors.response.use(data => {
  if (data.status && data.status === 200 && data.data.status === 'error') {
    Message.error({
      message: data.data.msg
    })
    return
  }
  return data
}, err => {
  // console.error('[+] HandleErr: ', err)
  showErr(err)
  // if (err.response.status === 504 || err.response.status === 404) {
  //   showErr('服务器被吃了⊙﹏⊙∥')
  // } else if (err.response.status === 403) {
  //   showErr('权限不足,请联系管理员!')
  // } else if (err.response.status === 401) {
  //   console.log('233')
  //   showErr('还未登录, 请登录后再试!')
  //   window.localStorage.removeItem('token')
  // } else if (err.response.data.detial) {
  //   showErr(err.response.data.detial)
  // } else {
  //   showErr('未知错误!')
  // }
  return Promise.resolve(err)
})

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
const isHttpSuccess = function (status) {
  return (status >= 200 && status < 300) || status === 304
}

function request (url, params, data, method) {
  return new Promise((resolve, reject) => {
    let config = {
      url: baseUrl + url,
      method,
      headers: {
        'Authorization': 'token ' + window.localStorage.token
      },
      params,
      data
    }
    axios(config).then(res => {
      if (isHttpSuccess(res.status)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

function requestWithouToken (url, params, data, method) {
  return new Promise((resolve, reject) => {
    let config = {
      url: baseUrl + url,
      method,
      params,
      data
    }
    axios(config).then(res => {
      if (isHttpSuccess(res.status)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

function SimpleGet (url, params, data) {
  return requestWithouToken(url, params, data, 'get')
}

function SimplePost (url, params, data) {
  return requestWithouToken(url, params, data, 'post')
}

function Get (url, params, data) {
  return this.request(url, params, data, 'get')
}

function Post (url, params, data) {
  return this.request(url, params, data, 'post')
}

function Patch (url, params, data) {
  return this.request(url, params, data, 'patch')
}

function Delete (url, params, data) {
  return this.request(url, params, data, 'delete')
}

function UploadFile (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${baseUrl}${url}`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res)
      if (isHttpSuccess(res.status)) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  baseUrl,
  request,
  Get,
  Post,
  Patch,
  Delete,
  SimpleGet,
  SimplePost,
  UploadFile
}
