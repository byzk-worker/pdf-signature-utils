/**
 * 检测对象是否为空
 * @param {*} e 入参
 * @returns 如果对象为空，返回true
 */
export const isNull = (e: any) => e === null || e === undefined || e === '';

/**
 * 要检测的数组对象
 * @param e 入参
 * @returns 如果数组为空或者长度小于等于0，返回true
 */
export const arrayIsNull = (e: any[]) => isNull(e) || e.length <= 0;

/**
 * 生成GUID
 */
export const newGuid = () => {
    var curguid = "";
    for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curguid += id;
        if (i === 8 || i === 12 || i === 16 || i === 20) curguid += "";
    }
    return curguid;
};

/**
 * 是否是对象
 */
export const isObject = (e: any) => {
    if (isNull(e)) {
        return false;
    }
    return e.toString() === "[object Object]";
}

/**
 * mm转换为px
 * @param value
 * @returns {number}
 */
export function mmConversionPx(value: number) {
    var inch = value / 25.4;
    var c_value = inch * 72;
    //      console.log(c_value);
    return c_value;
}