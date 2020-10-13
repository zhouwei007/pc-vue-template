class Utils {
  static randString (len = 8) {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let str = ''
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return str
  }
  static formatMoney (amount, fixed = 2, unit = 'cent', split = true) {
    amount = Number(amount)
    if (isNaN(amount)) {
      return ''
    }
    amount = (unit === 'cent' ? amount / 100 : amount).toFixed(fixed)
    return String(amount).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, split ? '$1,' : '$1')
  }
  /**
  * time 时间戳
  * format 时间格式  'yyyy年MM月dd日 hh:mm:ss' 'yyyy/MM/dd hh:mm:ss' yyyy年MM月dd日
  * **/
  static fmtTime (time, format) {
    if (!time) return
    let date = new Date(Number(time))
    let o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  /**
  * date 时间格式
  * format 时间格式  'yyyy年MM月dd日 hh:mm:ss' 'yyyy/MM/dd hh:mm:ss' yyyy年MM月dd日
  * **/
  static dateFormat(date, fmt='YYYY-mm-dd') {
    let ret;
    let opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}
  static fitterSelect (arr = [], val, valueKey = 'value', labelKey = 'label') {
    return arr.find( item => item[valueKey] === val)?arr.find( item => item[valueKey] === val)[labelKey]:''
  }
  static deepCopy (p, c) {
    c = c || {};
    for (let i in p) {
      if (typeof p[i] === 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {};
        this.deepCopy(p[i], c[i]);
      } else {
        c[i] = p[i];
      }
    }
    return c;
  }
  static kebabCase(str) {
    const hyphenateRE = /([^-])([A-Z])/g;
    return str
      .replace(hyphenateRE, '$1-$2')
      .replace(hyphenateRE, '$1-$2')
      .toLowerCase();
  }
  static filterOptions(options = [], key) {
    if ( !options.length||!key) {
      return ''
    }
     return  options.find( item => item.value == key).label
  }
  static checkIdCard(num) {
    // 校验身份证
    if (!num) {
      return false;
    }
    num = num.toUpperCase();
    const cityCode = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    if (!cityCode[num.substr(0, 2)]) {
      return false;
    }
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)) {
      return false;
    }
    // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    // 下面分别分析出生日期和校验位
    let re;
    const len = num.length;
    if (len == 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      const arrSplit = num.match(re);

      // 检查生日日期是否正确
      const dtmBirth = new Date(
        `19${arrSplit[2]}/${arrSplit[3]}/${arrSplit[4]}`
      );
      const bGoodDay = dtmBirth.getYear() == Number(arrSplit[2])
        && dtmBirth.getMonth() + 1 == Number(arrSplit[3])
        && dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bGoodDay) {
        // alert('输入的身份证号里出生日期不对！');
        return false;
      }
      // 将15位身份证转成18位
      // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      const arrInt = [
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      ];
      const arrCh = [
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      ];
      let nTemp = 0;
      let k;
      num = `${num.substr(0, 6)}19${num.substr(6, num.length - 6)}`;
      for (k = 0; k < 17; k++) {
        nTemp += num.substr(k, 1) * arrInt[k];
      }
      num += arrCh[nTemp % 11];
      return true;
    }
    if (len == 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      const arrSplit = num.match(re);

      // 检查生日日期是否正确
      const dtmBirth = new Date(
        `${arrSplit[2]}/${arrSplit[3]}/${arrSplit[4]}`
      );
      const bGoodDay = dtmBirth.getFullYear() == Number(arrSplit[2])
        && dtmBirth.getMonth() + 1 == Number(arrSplit[3])
        && dtmBirth.getDate() == Number(arrSplit[4]);
      if (!bGoodDay) {
        // alert(dtmBirth.getYear());
        // alert(arrSplit[2]);
        // alert('输入的身份证号里出生日期不对！');
        return false;
      }
      // 检验18位身份证的校验码是否正确。
      // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      // let valnum;
      const arrInt = [
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      ];
      const arrCh = [
        "1",
        "0",
        "X",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2"
      ];
      let nTemp = 0;
      let k;
      for (k = 0; k < 17; k++) {
        nTemp += num.substr(k, 1) * arrInt[k];
      }
      const valnum = arrCh[nTemp % 11];
      if (valnum != num.substr(17, 1)) {
        // alert('18位身份证的校验码不正确！应该为：' + valnum);
        return false;
      }
      return true;
    }
    return false;
  }
}
export default Utils
