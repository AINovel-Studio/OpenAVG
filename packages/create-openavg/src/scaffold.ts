import type { UserConfig } from './types'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'
import { copyTemplate, ensureDir, handleExistingDir } from './utils/file'
import { getTemplateDir, replaceInFile } from './utils/template'

/**
 * 执行脚手架创建流程
 * @param config 用户配置
 */
export async function scaffold(config: UserConfig): Promise<void> {
  const { targetDir, projectName, shouldInstall } = config

  // 1. 处理已存在的目录
  if (fs.existsSync(targetDir)) {
    const shouldContinue = await handleExistingDir(targetDir)
    if (!shouldContinue) {
      throw new Error('操作已取消')
    }
  }

  // 2. 创建目标目录
  prompts.log.step('创建项目目录...')
  ensureDir(targetDir)

  // 3. 获取模板目录
  const templateDir = getTemplateDir()

  // 4. 复制模板文件
  prompts.log.step('复制模板文件...')
  copyTemplate(templateDir, targetDir)

  // 5. 替换项目名称
  prompts.log.step('配置项目参数...')
  replaceProjectName(targetDir, projectName)

  // 6. 安装依赖（可选）
  if (shouldInstall) {
    await installDependencies(targetDir)
  }

  prompts.log.success(colors.green('项目创建成功！'))
}

/**
 * 替换项目名称
 */
function replaceProjectName(targetDir: string, projectName: string): void {
  const packageJsonPath = path.join(targetDir, 'package.json')
  replaceInFile(packageJsonPath, {
    '"name": "@openavg/playground"': `"name": "${projectName}"`,
  })
}

/**
 * 安装依赖
 */
async function installDependencies(targetDir: string): Promise<void> {
  const spinner = prompts.spinner()
  spinner.start('正在安装依赖...')

  try {
    // 检测包管理器
    const { determineAgent } = await import('@vercel/detect-agent')
    const agentResult = await determineAgent()
    const packageManager = agentResult?.agent?.name || 'npm'

    prompts.log.info(`使用 ${packageManager} 安装依赖`)

    // 执行安装
    await new Promise<void>((resolve, reject) => {
      const child = spawn(packageManager, ['install'], {
        cwd: targetDir,
        stdio: 'inherit',
        shell: true,
      })

      child.on('close', (code: number | null) => {
        code !== 0 ? reject(new Error(`退出码: ${code}`)) : resolve()
      })

      child.on('error', reject)
    })

    spinner.stop('依赖安装完成 ✓')
  }
  catch (error) {
    spinner.stop('依赖安装失败 ✗')
    prompts.log.warn(colors.yellow('请手动运行安装命令'))
    if (error instanceof Error) {
      prompts.log.error(error.message)
    }
  }
}
