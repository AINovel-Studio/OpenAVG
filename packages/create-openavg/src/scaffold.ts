import type { UserConfig } from './types'
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
  const { targetDir, projectName } = config

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
