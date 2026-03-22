import fs from 'node:fs'
// 😋：https://github.com/Panzer-Jack/img-ascii-term
import { convertImageToAscii } from 'img-ascii-term'

const ciallo = await convertImageToAscii('./yulia-chan.jpg', { width: 50, charset: '#' })
fs.writeFileSync('./yulia-chan.ascii', ciallo)
console.log(ciallo)
