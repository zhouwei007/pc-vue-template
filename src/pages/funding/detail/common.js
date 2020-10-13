import Utils from '@/common/utils'
class FundCommon {
  static getFormValue (formData) {
    let result = {}
    for (let i = 0; i < formData.length; i++) {
      let form = formData[i]
      for (let j = 0; j < form.basicFields.length; j++) {
        let field = form.basicFields[j]
        if (field.type === 'checkbox') {
          let val = ''
          for (let m = 0; m < field.value.length; m++) {
            if (field.value[m] && field.value[m] !== 'checkAll') {
              val += field.value[m] + ','
            }
          }
          result[field.fieldNameCode] = val
        } else if (field.type === 'rangeinput') {
          result[`${field.fieldNameCode}Max`] = field.value.end
          result[`${field.fieldNameCode}Min`] = field.value.start
        } else {
          result[field.fieldNameCode] = field.value
        }
      }
    }
    return Utils.deepCopy(result)
  }
  static getFormTemplate (obj, formData) {
    // 特殊字段处理 serverRate partnerRate orgRebateRate
    let spaciel = ['serverRate', 'partnerRate', 'orgRebateRate']
    obj = this.spacielField(spaciel, obj)
    // 产品详情字段
    for (let i = 0; i < formData.length; i++ ) {
      for (let j = 0; j < formData[i].basicFields.length; j++) {
        let field = formData[i].basicFields[j]
        if (field.type === 'checkbox') {
          if (obj[field.fieldNameCode]) {
            let valArr = obj[field.fieldNameCode].split(',')
            valArr.map((val) => {
              field.value.push(val)
            })
          }
        } else if (field.type === 'rangeinput') {
          if (obj[`${field.fieldNameCode}Max`]) {
            let result = obj[`${field.fieldNameCode}Max`]
            field.value.end = (result || result == 0) ? result.toString() : ''
          }
          if (obj[`${field.fieldNameCode}Min`]) {
            let result = obj[`${field.fieldNameCode}Min`]
            field.value.start = (result || result == 0) ? result.toString() : ''
          }
        } else if (field.type === 'text-button') {
          // 产品归属 联动 资金方
          if (field.fieldNameCode === 'productAffiliation') {
            let value = formData[0].basicFields[0].value
            let result = formData[0].basicFields[0].options.find((item) => {
              return item.code == value
            })
            if (result) {
              field.btnText = result.name
            }
            let fanal = obj[field.fieldNameCode]
            field.value = (fanal || fanal == 0) ? fanal.toString() : ''
          }
        } else {
          if (obj[field.fieldNameCode] || obj[field.fieldNameCode] === 0) {
            if (typeof(obj[field.fieldNameCode]) == 'object') {
              field.value = obj[field.fieldNameCode]
            } else {
              let result = obj[field.fieldNameCode]
              field.value = (result || result == 0) ? result.toString() : ''
            }
          }
        }
      }
    }
    // 城市信息
    let fundFeeDetailListTemplate = []
    for(let m = 0; m < obj.fundFeeDetailList.length; m++) {
      let fundFeeTemp = Utils.deepCopy(formData[1])
      for (let n = 0; n < fundFeeTemp.basicFields.length; n++) {
        let field = fundFeeTemp.basicFields[n]
        if (obj[field.fieldNameCode] || obj[field.fieldNameCode] === 0 || obj[`${field.fieldNameCode}Min`] || obj[`${field.fieldNameCode}Max`]) {
          if (field.type === 'checkbox') {
            if (obj.fundFeeDetailList[m][field.fieldNameCode]) {
              field.value = []
              let valArr = obj.fundFeeDetailList[m][field.fieldNameCode].split(',')
              valArr.map((val) => {
                if (field.value.indexOf(val) < 0 && val !== 'checkAll') {
                  field.value.push(val)
                }
              })
            }
          } else if (field.type === 'rangeinput') {
            if (obj.fundFeeDetailList[m][`${field.fieldNameCode}Min`]) {
              let result = obj.fundFeeDetailList[m][`${field.fieldNameCode}Min`]
              field.value.start = (result || result == 0) ? result.toString() : ''
            }
            if (obj.fundFeeDetailList[m][`${field.fieldNameCode}Max`]) {
              let result = obj.fundFeeDetailList[m][`${field.fieldNameCode}Max`]
              field.value.end = (result || result == 0) ? result.toString() : ''
            }
          } else {
            if (obj.fundFeeDetailList[m][field.fieldNameCode]) {
              if (typeof(obj.fundFeeDetailList[m][field.fieldNameCode]) == 'object') {
                field.value = obj.fundFeeDetailList[m][field.fieldNameCode]
              } else {
                let result = obj.fundFeeDetailList[m][field.fieldNameCode]
                field.value = (result || result == 0) ? result.toString() : ''
              }
            }
          }
        }
      }
      fundFeeDetailListTemplate.push(fundFeeTemp)
    }
    return fundFeeDetailListTemplate
  }
  // 特殊字段处理
  static spacielField(fields, obj) {
    fields.map((field) => {
      obj[field] = obj[field] / 1000
      if (obj.fundFeeDetailList) {
        obj.fundFeeDetailList.map((item) => {
          item[field]= item[field] / 1000
        })
      }
    })
    return obj
  }
}
export default FundCommon