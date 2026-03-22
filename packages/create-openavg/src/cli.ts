import type { CliOptions, UserConfig } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as prompts from '@clack/prompts'
import mri from 'mri'
import colors from 'picocolors'
import { scaffold } from './scaffold'
import { getPromptMessages } from './utils/prompt'
import { validateProjectName } from './utils/validation'

/**
 * 运行 CLI
 */
export async function runCli(): Promise<void> {
  const argv = mri<CliOptions>(process.argv.slice(2), {
    boolean: ['help', 'version'],
    alias: {
      h: 'help',
      v: 'version',
    },
  })

  if (argv.help) {
    showHelp()
    return
  }

  if (argv.version) {
    showVersion()
    return
  }

  prompts.intro(colors.cyan('🎮 OpenAVG 项目脚手架'))
  prompts.log.info('快速创建基于 Vue3 + Pixi.js 的视觉小说游戏项目')

  const config = await collectUserInput(argv)

  if (!config) {
    prompts.cancel('操作已取消')
    return
  }

  await scaffold(config)

  showSuccessMessage(config)
}

/**
 * 收集用户输入
 */
async function collectUserInput(argv: CliOptions): Promise<UserConfig | null> {
  const messages = getPromptMessages()

  // 1. 项目名称（支持位置参数）
  let projectName = argv._ && argv._[0]
  if (!projectName) {
    const result = await prompts.text({
      message: messages.projectName,
      placeholder: 'my-openavg-game',
      validate: validateProjectName,
    })
    if (prompts.isCancel(result))
      return null
    projectName = result as string
  } else {
    // 验证命令行提供的项目名称
    const error = validateProjectName(projectName)
    if (error) {
      prompts.log.error(colors.red(error))
      return null
    }
  }

  // 2. 是否安装依赖
  const shouldInstall = await prompts.confirm({
    message: messages.shouldInstall,
    initialValue: true,
  })
  if (prompts.isCancel(shouldInstall))
    return null

  // 3. 计算目标目录
  const targetDir = path.join(process.cwd(), projectName)

  return {
    projectName,
    targetDir,
    shouldInstall: shouldInstall as boolean,
  }
}

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
${colors.cyan('create-openavg')} - 创建 OpenAVG 项目

${colors.bold('用法:')}
  create-openavg [项目名称] [选项]

${colors.bold('选项:')}
  -h, --help              显示帮助信息
  -v, --version           显示版本信息

${colors.bold('示例:')}
  ${colors.dim('# 交互式创建项目')}
  create-openavg

  ${colors.dim('# 使用位置参数指定项目名称')}
  create-openavg my-game
  `)
}

/**
 * 显示版本信息
 */
function showVersion(): void {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const packageJsonPath = path.resolve(__dirname, '../package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    console.log(packageJson.version)
  } catch {
    console.warn('error: unable to read version')
  }
}

/**
 * 显示成功提示信息
 */
function showSuccessMessage(config: UserConfig): void {
  const { targetDir, shouldInstall } = config
  const cdPath = path.relative(process.cwd(), targetDir)

  const nextSteps = [
    `cd ${cdPath}`,
    !shouldInstall && 'pnpm install',
    'pnpm dev',
  ].filter(Boolean)

  prompts.outro(
    colors.green(`
✨ 项目创建成功！

下一步操作：
${nextSteps.map(step => `  ${colors.cyan(step)}`).join('\n')}

📚 文档: https://github.com/Panzer-Jack/OpenAVG
    `),
  )
}
