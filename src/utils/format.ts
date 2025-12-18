// 文件大小格式化 - 支持 bigint
// export function formatBytes(bytes: number | bigint | string | undefined | null, decimals = 2) {
//   // 处理空值或无效值
//   if (bytes === undefined || bytes === null || bytes === "") {
//     return "0 Bytes"
//   }

//   // 将字符串转换为 bigint 或 number
//   let numBytes: bigint | number
//   if (typeof bytes === "string") {
//     // 尝试解析为 bigint
//     try {
//       numBytes = BigInt(bytes)
//     } catch (error) {
//       // 如果解析失败，尝试解析为 number
//       numBytes = parseFloat(bytes)
//       if (isNaN(numBytes)) {
//         return "未知大小"
//       }
//     }
//   } else {
//     numBytes = bytes
//   }

//   // 处理零值
//   if (numBytes === 0 || numBytes === 0n) {
//     return "0 Bytes"
//   }

//   const k = 1024
//   const dm = decimals < 0 ? 0 : decimals
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

//   // 根据类型选择不同的计算方式
//   if (typeof numBytes === "bigint") {
//     const i = Math.floor(Math.log(Number(numBytes)) / Math.log(k))
//     if (i === 0) {
//       return `${numBytes} Bytes`
//     }

//     const unitValue = BigInt(Math.pow(k, i))
//     const result = Number(numBytes / unitValue) + Number(numBytes % unitValue) / Number(unitValue)

//     return parseFloat(result.toFixed(dm)) + " " + sizes[i]
//   } else {
//     const i = Math.floor(Math.log(numBytes) / Math.log(k))
//     return parseFloat((numBytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
//   }
// }
// 文件大小格式化 - 支持 bigint
export function formatBytes(bytes: number | bigint | string | undefined | null, decimals = 2) {
  // 处理空值或无效值
  if (bytes === undefined || bytes === null || bytes === "") {
    return "0 Bytes"
  }

  // 将字符串转换为 bigint 或 number
  let numBytes: bigint | number
  if (typeof bytes === "string") {
    // 尝试解析为 bigint
    try {
      numBytes = BigInt(bytes)
    } catch (error) {
      // 如果解析失败，尝试解析为 number
      numBytes = parseFloat(bytes)
      if (isNaN(numBytes)) {
        return "未知大小"
      }
    }
  } else {
    numBytes = bytes
  }

  // 处理零值
  if (numBytes === 0 || numBytes === 0n) {
    return "0 Bytes"
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  // 根据类型选择不同的计算方式
  if (typeof numBytes === "bigint") {
    // 使用 bigint 运算来计算单位
    let i = 0
    let size = numBytes
    const kBig = BigInt(k)
    
    // 找到合适的单位
    while (size >= kBig && i < sizes.length - 1) {
      size /= kBig
      i++
    }
    
    // 转换为浮点数并保留小数位
    const sizeNum = Number(size)
    // 计算余数以获取小数部分
    const remainder = numBytes % (kBig ** BigInt(i))
    const decimalValue = remainder === 0n ? 0 : Number(remainder) / Number(kBig ** BigInt(i))
    
    const result = sizeNum + decimalValue
    return result.toFixed(dm) + " " + sizes[i]
  } else {
    // 对于普通数字的处理
    const i = Math.floor(Math.log(numBytes) / Math.log(k))
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
}

// 日期时间格式化
export function formatDateTime(dateTime: string | Date) {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
