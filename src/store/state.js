const state = {
  loginInfo: {
  },
  paraFormatCheck: {},
  authorization: {},
  taskStatusMap: [],
  cityMap: [
    {
      value: '110000',
      label: '北京'
    },
    {
      value: '120000',
      label: '天津'
    },
    {
      value: '610000',
      label: '西安'
    }
  ],
  demandsStatusMap: [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '待办理'
    },
    {
      value: 2,
      label: '办理中'
    },
    {
      value: 3,
      label: '审核中'
    },
    {
      value: 4,
      label: '已废弃'
    },
    {
      value: 5,
      label: '放款中'
    },
    {
      value: 6,
      label: '已放款'
    }
  ],
  borrowStatusMap: [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '待办理'
    },
    {
      value: 2,
      label: '办理中'
    },
    {
      value: 3,
      label: '审核中'
    },
    {
      value: 4,
      label: '已废弃'
    },
    {
      value: 5,
      label: '放款中'
    },
    {
      value: 6,
      label: '已放款'
    }
  ],
  fundMap: [
    {
      value: 1,
      label: '狐狸普惠'
    },
    {
      value: 2,
      label: '浦发银行'
    },
    {
      value: 3,
      label: '浙商银行'
    }
  ],
  workflowMap: [],
  decisionTypeMap: [],
  productMap: [
  ],
  leftBar: []
}

export default state
