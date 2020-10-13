import Modal from './src/modal'
import Content from './src/content'
import Upload from './src/upload'

Modal.install = Vue => {
  Vue.component(Modal.name, Modal)
}

Content.install = Vue => {
  Vue.component(Content.name, Content)
}
Upload.install = Vue => {
  Vue.component(Upload.name, Upload)
}

export default Modal
export { 
  Modal, 
  Content,
  Upload 
}
