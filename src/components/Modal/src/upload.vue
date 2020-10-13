<template>
  <div class="upload-box">
    <div class="upload">
      <div class="upload-breviary2" v-if="!!files.url">
        <!-- 图片 -->
        <img class="picture" :src="files.url"/>
      </div>
      <div class="upload-opera" @click="deleteFiles" v-if="!!files.url">删除文件</div>
      <!-- 上传 -->
      <div class="upload-opera">
        <input
          class="upload-file"
          type="file"
          :accept="accept"
          @change="handleChange"
        />
        <i>选择文件</i>
      </div>
    </div>
  </div>
</template>

<script>
import UploadApi from '@/common/api/upload'
export default {
  name: 'Upload',
  data () {
    return {
      files: {}
    }
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    fileId: {
      default: null
    },
    fileUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    initFiles () {
      let fileId = this.fileId
      if (this.fileUrl) {
        this.$set(this.files, 'url', this.fileUrl)
        return
      }
      if (!fileId) return
      UploadApi.getFileUrl(fileId).then((data) => {
        this.$set(this.files, 'url', data)
      })
    },
    handleChange (e) {
      for (const file of e.target.files) {
        this.files = {
          file,
          miniUrl: URL.createObjectURL(file),
          url: URL.createObjectURL(file)
        }
      }
      this.upload(e.target)
    },
    upload (target) {
      // this.$emit('update:value', 'jinjian/20191231103122atwNpGpv.jpg')
      UploadApi.upload(target.files).then((data) => {
        let key = (Array.isArray(data.response) && data.response[0] && data.response[0].key) || null
        this.$emit('update:value', key)
        this.$emit('change', key)
      })
    },
    deleteFiles () {
      this.files = {}
      this.$emit('update:value', '')
      this.$emit('change', '')
    }
  },
  mounted () {
    this.initFiles()
  }
}
</script>

<style lang="scss" scope>
.upload-box {
  display: flex;
  align-items: center;
  .upload {
    display: flex;
    width: 100%;
    overflow: hidden;
    .upload-opera:last-child{
      margin-right: 0px;
    }
    .upload-opera{
      width: 80px;
      height: 30px;
      line-height: 30px;
      position: relative;
      background: #fff;
      border: 1px solid #6975C9;
      border-radius: 4px;
      text-align: center;
      margin-right: 12px;
      font-size: 12px;
      color:#6975C9;
      cursor: pointer;
      margin-top: 10px;
      i{
        cursor: pointer;
      }
      .upload-file {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
    .upload-breviary2 {
      width: 50px;
      height: 50px;
      text-align: center;
      margin-right: 12px;
      background: #FAFAFA;
      border: 1px solid #E2E6ED;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      .picture {
        height: 100%;
        border-radius: 4px;
      }
    }
  }
}
</style>
