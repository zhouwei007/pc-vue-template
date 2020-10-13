import BaseRequest from '@/common/request'

class UploadApi extends BaseRequest {
  constructor () {
    super()
  }

  async upload (files) {
    const url = '/ufile/upload'
    const formData = new FormData()
    const token = await this._getToken()
    formData.append('source', 2009)
    formData.append('token', token)
    formData.append('isPrivate', true)
    for (let i = 0; i < files.length; i++) {
      formData.append('sfiles', files[i])
    }
    return super.post(url, formData, {
      loading: false
    })
  }

  _getToken () {
    const url = '/gateway/saas-harbour/query/getToken'
    return super.post(url, null, {
      loading: false
    })
  }
  
  getFileUrl (fileId) {
    const url = '/gateway/saas-harbour/ufile/getDownLoadUrl'
    let param = {
      fileId: fileId
    }
    return super.post(url, param, {
      loading: false
    })
  }
}

export {
  UploadApi as Upload
}

export default new UploadApi()