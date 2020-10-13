<template>
  <div class="upload-box">
    <transition-group name="flip-list" :class="{upload: true, all: isShowAll}">
      <div
        v-for="(img, index) in files"
        class="upload-breviary"
        draggable="true"
        @dragstart="imgDragStart(index)"
        @drag="imgDrag"
        @dragenter="imgDragEnter(index)"
        :key="index+img.url"
        @click="showPreview(index)"
      >
        <!-- 图片 -->
        <img class="picture" :src="img.url"/>
        <!-- 蒙层 -->
        <div :class="{'pic-mask': true, black: index===foldIndex && !isShowAll}">
          <div v-if="index===foldIndex && !isShowAll" class="total">
            <div class="total-num">{{files.length}}</div>
            <div class="total-text">张照片</div>
          </div>
          <div v-else class="search-box">
            <i class=" hl-icon-search"></i>
          </div>
        </div>
        <!-- 收起 -->
        <div v-show="isShowAll && index===files.length-1" class="part" @click.stop.prevent="showPart">收起</div>
        <!-- <div v-if="errorMsg.length>0" class="error">{{errorMsg}}</div> -->
      </div>
      <!-- 无图片默认 -->
      <div v-if="files.length == 0 && isPictureViewer" class="upload-breviary no-cursor" key="no-picture">
        <i class="hl-icon hl-icon-372"></i>
      </div>
      <!-- 上传 -->
      <div v-if="!isPictureViewer" class="upload-box" key="upload">
        <input
          class="upload-file"
          type="file"
          :accept="accept"
          :multiple="multiple"
          @change="handleChange"
        />
        <i class="hl-icon hl-icon-373"></i>
        <div v-if="errorMsg.length>0" class="error">{{errorMsg}}</div>
      </div>
    </transition-group>
    <!-- 图片查看器 -->
    <Preview
      :show="isShowPreview"
      :fileList="files"
      @close="closePreview"
      :curIndex="previewIndex"
    />
    <!-- 删除 -->
    <div
      v-show="this.files.length>0 && !isPictureViewer"
      :class="{delete: true, over: isOverDelete}"
      @dragenter="deleteDragenter()"
      @dragover="deleteDragover()"
      @dragleave="deleteDragleave()"
    >
      <i class="hl-icon hl-icon-295"></i>
    </div>
  </div>
</template>

<script>
import UploadApi from '@/common/api/upload'
import Preview from '@/components/Preview'
// import FormData from 'form-data'
export default {
  name: 'Upload',
  components: {
    Preview
  },
  data () {
    return {
      isShowPreview: false,
      isShowAll: false,
      previewIndex: 0,
      files: [],
      errorMsg: '',
      isOverDelete: false,
      curDragEleIndex: -1,
      foldIndex: 3
    }
  },
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isPictureViewer: {
      type: Boolean,
      default: false
    },
    required: {
      type: [Boolean, Number],
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },
  methods: {
    async initFiles () {
      for (let i = 0; i < this.fileList.length; i++) {
        let fileId = this.fileList[i].fileId
        try{
          if (fileId) {
            this.fileList[i].url = (await UploadApi.getFileUrl(fileId)) + '&iopcmd=thumbnail&type=7&width=150&height=150'
            this.files.push(this.fileList[i])
          }
        }
        catch (e) {
          throw new Error('图片获取url失败'+e)
        }
      /*  UploadApi.getFileUrl(fileId).then((data) => {
          this.fileList[i].url = data
          this.files.push(this.fileList[i])
        })*/
      }
    },
    showPreview (index) {
      if (index === this.foldIndex && this.files.length > this.foldIndex && !this.isShowAll) {
        this.isShowAll = true
      } else {
        this.isShowPreview = true
        this.previewIndex = index
      }
    },
    closePreview () {
      this.isShowPreview = false
    },
    showPart () {
      this.isShowAll = false
    },
    handleChange (e) {
      this.upload(e.target)
    },
    upload (target) {
      this.errorMsg = ''
      let total = 0;
      for (const file of target.files) {
        total = total + file.size
      }
      if (total/(1024*1000) > 100) {
        this.errorMsg = '上传文件过大，请分批上传'
        return
      }
      UploadApi.upload(target.files).then((data) => {
        const tempList = []
        for (const file of target.files) {
          tempList.push({
            file,
            miniUrl: URL.createObjectURL(file),
            url: URL.createObjectURL(file)
          })
        }
        this.files = this.files.concat(tempList)
        // for (let i = 0; i < target.files.length; i++) {
          // delete target.files[i]
        // }
        this.$emit('change', data.response)
        target.value = '' // 用于解决同一图片不能重复上传的问题。每次上传后value置空可解决。
      }, () => {
        this.errorMsg = '上传失败，请重新上传'
        target.value = ''
      })
    },
    validate () {
      this.errorMsg = ''
      if ((this.required && this.files.length === 0) || this.errorMsg) {
        this.errorMsg = `请上传${this.label}`
        return false
      }
      return true
    },
    deleteDragenter () {
    },
    deleteDragover () {
      if (this.curDragEleIndex !== -1) {
        this.files.splice(this.curDragEleIndex, 1)
        this.curDragEleIndex = -1
        this.isOverDelete = true
        this.$emit('delete', this.files)
      }
    },
    deleteDragleave () {
      this.isOverDelete = false
    },
    // imgDragEnd (index) {
    // },
    imgDragStart (index) {
      this.curDragEleIndex = index
    },
    imgDragEnter (index) {
      if (this.curDragEleIndex !== index) {
        let tempEle = this.files[this.curDragEleIndex]
        this.files.splice(this.curDragEleIndex, 1)
        this.files.splice(index, 0, tempEle)
        this.curDragEleIndex = index
      }
    },
    imgDrag () {},
    getWidth () {
      let uploadBoxes = document.getElementsByClassName('upload-box')
      if (uploadBoxes.length > 0) {
        let wid = uploadBoxes[0].offsetWidth
        if (wid >= 462) {
          this.foldIndex = 5
        }
      }
    }
  },
  mounted () {
    this.getWidth()
    this.initFiles()
  }
}
</script>

<style lang="scss" scope>
.upload-box {
  display: flex;
  align-items: center;
  .upload {
    max-width: 512px;
    min-height: 152px;
    display: flex;
    flex-wrap: wrap;
    max-height: 304px;
    overflow: hidden;
    translate: height 0.3s;
    &.all {
      max-height: none;
    }
    .upload-box {
      width: 142px;
      height: 142px;
      position: relative;
      background: #FAFAFA;
      border: 1px solid #E2E6ED;
      border-radius: 4px;
      margin-right: 12px;
      text-align: center;
      .upload-file {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .hl-icon-373 {
        line-height: 142px;
        color: #E1E2E3;
        font-size: 32px;
        margin-left: 55px;
      }
    }
    .error {
      min-height: 24px;
      line-height: 24px;
      position: absolute;
      bottom: 0;
      background: #FFF1EB;
      border: 1px solid #F6622C;
      border-radius: 2px;
      font-size: 12px;
      color: #F7622C;
      z-index: 12;
      padding: 0 7px;
      &:before {
        content: '';
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom-color: #F6622C;
        position: absolute;
        left: 50%;
        top: 0;
        margin-top: -12px;
        margin-left: -3px;
      }
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-bottom-color: #FFF1EB;
        position: absolute;
        left: 50%;
        top: 0;
        margin-top: -8px;
        margin-left: -1px;
      }
    }
    .upload-breviary {
      width: 142px;
      height: 142px;
      text-align: center;
      margin: 0 12px 12px 0;
      background: #FAFAFA;
      border: 1px solid #E2E6ED;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      &:hover {
        .pic-mask {
          display: block;
        }
      }
      &.no-cursor {
        cursor: default;
      }
      .picture {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      .hl-icon-372 {
        line-height: 142px;
        color: #E1E2E3;
        font-size: 32px;
      }
      .pic-mask {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.22);
        &.black {
          display: block;
          background: rgba(0,0,0,0.4)
        }
        .search-box {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: rgba(0,0,0,0.5);
          position: absolute;
          right: 6px;
          bottom: 6px;
          text-align: center;
          .hl-icon-search {
            line-height: 24px;
            color: #ffffff;
          }
        }
        .total {
          line-height: 24px;
          color: #ffffff;
          margin-top: 46px;
          .total-num {
            font-family: 'PingFangSC-Semibold';
            font-size: 24px;
          }
          .total-text {
            font-size: 14px;
          }
        }
      }
      .part {
        position: absolute;
        right: 6px;
        bottom: 6px;
        width: 36px;
        height: 20px;
        line-height: 20px;
        background: rgba(51,51,51,0.7);
        font-size: 12px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
      }
    }
  }
  .delete {
    // width: 60px;
    // height: 60px;
    background: #FFFFFF;
    // box-shadow: 0 0 14px 0 rgba(225,226,227,0.80);
    // border-radius: 30px;
    cursor: pointer;
    // margin: 0 5px;
    transition: all 0.3s ease-in;
    display: flex;
    align-items: center;
    justify-content: center;
    .hl-icon-295 {
      font-size: 30px;
      color: #666780;
      transition: all 0.3s ease-in;
    }
    &:hover,&.over {
      // width: 80px;
      // height: 80px;
      // border-radius: 40px;
      margin: 0;
      .hl-icon-295 {
        font-size: 40px;
      }
    }
  }
  .flip-list-move {
    transition: transform 0.2s;
  }
  .flip-list-enter-active, .flip-list-leave-active {
    transition: opacity .2s ease;
  }
  .flip-list-enter, .flip-list-leave-to{
    opacity: 0;
  }
}
</style>
