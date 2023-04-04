// 云函数代码
const cloud = require('wx-server-sdk')
const md5 = require('md5')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 支付md5加密获取sign
function paysignjs(jsonobj) {
  var signstr = obj2str(jsonobj)
  // signstr = signstr + '&key=' + key;
  console.log("signstrkey:",signstr)
  var sign = md5(signstr); //验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。
  console.log("sign:",sign)

  return sign.toUpperCase()
}
//object转string,用于签名计算
function obj2str(args) {
  var keys = Object.keys(args)
  keys = keys.sort() //参数名ASCII码从小到大排序（字典序）；
  var newArgs = {}
  keys.forEach(function (key) {
    if (args[key] != "" && args[key] != 'undefined') {  //如果参数的值为空不参与签名；
      newArgs[key] = args[key]  //参数名区分大小写；
    }
  })
  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}
// //随机函数的产生：
// function createNonceStr() {
//   return Math.random().toString(36).substr(2, 15)   //随机小数，转换36进制，去掉0.，保留余下部分
// }
//时间戳产生的函数, 当前时间以证书表达，精确到秒的字符串
// function createTimeStamp() {
//   return parseInt(new Date().getTime() / 1000) + ''
// }
function getOrderNo(randomLen) {
  var random_no = "";
  for (var i = 0; i < randomLen; i++) {
    random_no += Math.floor(Math.random() * 10);
  }
  // random_no = new Date().getTime() + Number(random_no);
  return random_no;
}
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('上下文',wxContext, context);
  const reqObj = {
    functionName: "paycb",
    envId: 'wuxiewenhua-0gp4566t9d224161',
    // nonceStr: '', // 随机字符串
    body : "小秋TIT店-超市",
    outTradeNo : getOrderNo(32),
    spbillCreateIp : wxContext.CLIENTIP || wxContext.CLIENTIPV6,
    subMchId : "1641346834",
    totalFee : 1,
    tradeType: 'JSAPI'
  }
  const nonceStr = paysignjs(reqObj)
  console.log('nonceStr', nonceStr);
  reqObj.nonceStr = nonceStr
  console.log('请求参数', reqObj);
  const res = await cloud.cloudPay.unifiedOrder(reqObj)
  return res
}

// // 小程序代码
// wx.cloud.callFunction({
//   name: '函数名',
//   data: {
//     // ...
//   },
//   success: res => {
//     const payment = res.result.payment
//     wx.requestPayment({
//       ...payment,
//       success (res) {
//         console.log('pay success', res)
//       },
//       fail (err) {
//         console.error('pay fail', err)
//       }
//     })
//   },
//   fail: console.error,
// })