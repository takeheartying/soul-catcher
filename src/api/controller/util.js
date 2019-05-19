const formatNumber = n => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

const formatDate = function (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('_') + '_' + [hour, minute, second].map(formatNumber).join('_')
}
export default {
  formatDate,
  formatNumber
}
