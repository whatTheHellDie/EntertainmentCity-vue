/**
 * 获取当前的小时和分钟，返回数据类型为整形
 */
export function getHoursAndMinutes () {
  var d = new Date()
  return d.getHours() * 100 + d.getMinutes()
}

/**
 * 将HHmm整数型的时间转换为 HH:mm 格式
 *
 * @param time
 * @returns {String}
 */
export function getHoursAndMinutesFmStr (time) {
  if ('' === time) {
		return "00:00"
	}else{
		time = parseInt(time)
		time = time >= 2400 ? time - 2400 : time
		return (time / 100 < 10 ? "0" + parseInt(time / 100) : parseInt(time / 100))
				+ ":" + (time % 100 < 10 ? "0" + time % 100 : time % 100)
	}
}

/**
 * 时间戳格式化成时间格式
 */
Date.prototype.format = function(format) {
	var date = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours() > 9 ? this.getHours() : "0" + this.getHours(),
		"m+" : this.getMinutes() > 9 ? this.getMinutes() : "0"
				+ this.getMinutes(),
		"s+" : this.getSeconds() > 9 ? this.getSeconds() : "0"
				+ this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S+" : this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '')
				.substr(4 - RegExp.$1.length));
	}
	for ( var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k]
					: ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}
