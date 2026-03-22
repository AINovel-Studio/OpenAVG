import process from 'node:process'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'
import { runCli } from './cli'

/**
 * 主函数
 */
export async function main(): Promise<void> {
  try {
    await runCli()
  } catch (error) {
    prompts.log.error(colors.red('创建项目失败'))
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exit(1)
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default main
