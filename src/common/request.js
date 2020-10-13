import axios from 'axios'
// import qs from 'query-string'
import FormData from 'form-data'
import Utils from 'common/utils'
import Validate from 'common/validate'
import { ServiceError, RequestError, ResponseError } from 'common/error'
import Loading from '@/components/Loading'
import store from '@/store'

class BaseRequest {
  constructor () {
    this.$http = axios.create({
      maxContentLength: 300000,
      responseType: 'json'
    })
    this.defaultConfig = {
      headers: {},
      auth: false,
      loading: true,
      throwError: true,
      original: false
    }
  }

  async get (url, params = null, config = {}) {
    this._handleLoading('open', config)
    let headers = await this._getHeaders(config)
    return new Promise((resolve, reject) => {
      this.$http.get(url, {
        headers: headers.headers,
        ...this._getTransformResponse(config),
        params: this._formatData(params),
        ...this._getAxiosConfig(config),
        ...this._getValidateStatus()
      }).then((response) => {
        let resultData = response.data ? response.data : response.request.response
        resolve(resultData)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  async post (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    this._handleLoading('open', config)
    let headers = await this._getHeaders(config, data)
    return new Promise((resolve, reject) => {
      this.$http.post(url, this._formatData(data), {
        ...headers,
        // ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        ...this._getAxiosConfig(config),
        ...this._getValidateStatus()
      }).then((response) => {
        let resultData = response.data ? response.data : response.request
        resolve(resultData)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  async put (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    let headers = await this._getHeaders(config, data)
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.put(url, this._formatData(data), {
        ...headers,
        // ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        ...this._getAxiosConfig(config),
        ...this._getValidateStatus()
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  async delete (url, data = null, config = {}) {
    config = { ...this.defaultConfig, ...config }
    let headers = this._getHeaders(config, data)
    this._handleLoading('open', config)
    return new Promise((resolve, reject) => {
      this.$http.delete(url, {
        ...headers,
        // ...this._getTransformRequest(config, data),
        ...this._getTransformResponse(config),
        data: this._formatData(data),
        ...this._getAxiosConfig(config),
        ...this._getValidateStatus()
      }).then((response) => {
        resolve(response.data)
      }).catch(async (err) => {
        reject(await this._getError(err))
      }).finally(() => {
        this._handleLoading('close', config)
      })
    })
  }

  jsonp (url, fn, config = {}) {
    const id = config.name || `_jsonp${Utils.randString()}`
    const param = config.param || 'callback'
    const timeout = config.timeout || 60000
    const target = document.getElementsByTagName('script')[0] || document.head
    let script
    let timer
    if (timeout) {
      timer = setTimeout(function () {
        cleanup()
        fn && fn(new Error('Timeout'))
      }, timeout)
    }
    function cleanup () {
      script.parentNode && script.parentNode.removeChild(script)
      window[id] = null
      timer && clearTimeout(timer)
    }
    function cancel () {
      window[id] && cleanup()
    }
    window[id] = data => {
      cleanup()
      fn && fn(data)
    }
    url += `${~url.indexOf('?') ? '&' : '?'}${param}=${encodeURIComponent(id)}`
    url = url.replace('?&', '?')
    script = document.createElement('script')
    script.src = url
    target.parentNode.insertBefore(script, target)
    return cancel
  }

  _getAxiosConfig (config = {}) {
    const result = { ...config }
    delete result.headers
    return result
  }

  async _getHeaders (config = {}, data = null) {
    const isFormData = data instanceof FormData
    let auth = await this._getAuthorization()
    return {
      headers: {
        'Authorization': `Bearer ${auth.access_token}`,
        'token': store.state.loginInfo.token,
        'Content-Type': isFormData
            ? `multipart/form-data; boundary=${data._boundary}`
            : 'application/json',
        ...config.headers
      }
    }
  }

  _formatData (data) {
    if (data instanceof FormData) {
      return data
    }
    const res = {
      t: new Date().getTime()
    }
    if (!data) {
      return res
    }
    return Object.keys(data).reduce((result, key) => {
      if (data[key] !== null && data[key] !== void 0) {
        result[key] = data[key]
      }
      return result
    }, res)
  }

  // _getTransformRequest (config, data) {
  // return {
  //   transformRequest: data instanceof FormData || config.headers['Content-Type'] === 'application/json'
  //     ? [] : [request => qs.stringify(request)]
  // }
  // }

  _getTransformResponse (config) {
    return {
      transformResponse: [(response) => {
        if (!response) {
          return response
        }
        const defaultErrorMessage = '系统服务内部错误'
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response)
          } catch (err) {
            throw new ServiceError(500, defaultErrorMessage)
          }
        }
        if (config.throwError) {
          if (response.code !== void 200 && response.code !== 200 && response.code !== '200') {
            let message = response.msg || defaultErrorMessage
            // throw new ResponseError(response.code, message)
            if (!response.code && !response.msg) {
              message = '账户已冻结'
            }
            throw message
          }
        }
        if (config.original) {
          return response
        }
        return response.data !== void 0 ? response.data : response.result
      }]
    }
  }

  _getValidateStatus () {
    return {
      validateStatus: function (status) {
        if (status == 401) {
          store.commit('setAuthorization', {})
          store.commit('setLoginInfo', '')
          window.location.href = window.location.origin + '/harbour/static/#/login'
        }
        return status >= 200 && status < 500;
      }
    }
  }
  
  _getAuthorization () {
    let auth = store.state.authorization
    return new Promise((resolve, reject) => {
      let curDate = new Date()
      let interval = (curDate - new Date(auth.getDate)) / 1000
      // console.log('interval:' + interval)
      // console.log('expires_in:' + auth.expires_in)
      if (JSON.stringify(auth) == "{}" || !auth.getDate) {
        this.$http.get(`/proxy/token`).then((response) => {
          if (response.data.expires_in <= 0) { // 如果获取的token已经过期
            store.commit('setAuthorization', {})
            store.commit('setLoginInfo', '')
            window.location.href = window.location.origin + '/harbour/static/#/login'
            return
          }
          let getDate = new Date()
          response.data.getDate = getDate
          store.commit('setAuthorization', response.data)
          resolve(response.data)
        }).catch(async (err) => {
          // 账户冻结返回的结构中没有code
          if (err.response && err.response.status == 401 && !err.response.data.code) {
            err = '账户已冻结'
            if (window.location.hash != '#/login') {
              store.commit('setAuthorization', {})
              store.commit('setLoginInfo', '')
              window.location.href = window.location.origin + '/harbour/static/#/login'
            }
          }
          reject(await this._getError(err))
        })
      } else if (interval > auth.expires_in - 100) { // 如果当前缓存中的token已经过期，100秒作为时间的窗口期
        store.commit('setAuthorization', {})
        store.commit('setLoginInfo', '')
        window.location.href = window.location.origin + '/harbour/static/#/login'
        return
      } else {
        resolve(auth)
      }
    })
  }

  _handleLoading (method, config) {
    const isServer = typeof window === 'undefined'
    if (isServer || !config.loading) {
      return
    }
    typeof config.loading === 'boolean'
        ? Loading[method]()
        : Loading[method](config.loading)
  }

  async _getError (err) {
    return err.name === 'ResponseError'
        ? new ResponseError(err.code, await this.getErrorMessage(err)) : err
  }

  async getErrorMessage (err) {
    return err
  }

  static validateParams (data, rules) {
    const validateResult = Validate.test(data, rules)
    if (!validateResult.result) {
      return new Promise((resolve, reject) => {
        reject(new RequestError(400, validateResult.message))
      })
    }
    return null
  }
}

export default BaseRequest
