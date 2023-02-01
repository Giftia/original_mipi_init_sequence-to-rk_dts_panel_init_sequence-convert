"use strict";
/**
 * Author: Giftina: https://github.com/Giftia/
 * 用于将厂家给的mipi屏初始化代码转换为RK系列的dts文件的panel-init-sequence。
 * 本程序基于 MIT 协议开源，欢迎 Fork 和 Star
 * Version: 0.0.2
 */

// 数据格式参考 https://blog.csdn.net/qq_38312843/article/details/107534743

const fs = require('fs');

function main() {
  const file = fs.readFileSync('mipi_init_sequence.txt', 'utf8');
  const lines = file.split('\r\n');
  const CMD_Type = { delay: '05', single: '15', multi: '39' };
  const lineSample = '{ "Type": "", "Delay": 0, "DataCount": 1, "Data": [] }'; // 命令类型，延时，数据长度，数据
  let lineTemp = { "Type": "", "Delay": 0, "DataCount": 1, "Data": [] };
  const result = []; // lineSample[]
  let CMDInProcess = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('SSD_CMD') || i === lines.length - 1) { // 遇到新的CMD或者到达文件末尾
      if (CMDInProcess) {
        // 上一组CMD已经结束，要将数据写入result
        CMDInProcess = false;
        // 判断CMD类型
        if (lineTemp.Type !== CMD_Type.delay) {
          if (lineTemp.DataCount > 2) {
            lineTemp.Type = CMD_Type.multi;
          } else {
            lineTemp.Type = CMD_Type.single;
          }
        }
        // 将count转换为16进制
        lineTemp.DataCount = lineTemp.DataCount.toString(16).padStart(2, '0');
        // 将delay转换为16进制
        lineTemp.Delay = lineTemp.Delay.toString(16).padStart(2, '0');
        // 将lineTemp写入result
        result.push(`[${lineTemp.Type} ${lineTemp.Delay} ${lineTemp.DataCount} ${lineTemp.Data.join(' ')}]`);
        // 重置lineTemp
        lineTemp = JSON.parse(lineSample);
      }
      CMDInProcess = true;
      if (i !== lines.length - 1) {
        lineTemp.Data.push(line.split('x')[1].split(')')[0]); // 将CMD写入Data
      }
    }
    else if (CMDInProcess && line.startsWith('SSD_PAR')) {
      lineTemp.DataCount++;
      lineTemp.Data.push(line.split('x')[1].split(')')[0]); // 将PAR写入Data
    }
    else if (CMDInProcess && line.startsWith('Delayms')) {
      lineTemp.Delay = Number(line.split('(')[1].split(')')[0]); // 将Delayms写入Delay
      lineTemp.Type = CMD_Type.delay;
    }
  }

  const resultStr = result.map(item => item.slice(1, -1)).join('\r\n');
  console.log(resultStr);
  fs.writeFileSync('panel-init-sequence.txt', resultStr);
}

main();
