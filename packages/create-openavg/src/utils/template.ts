import type { TemplateReplacements } from '../types'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 获取模板目录路径
 * @returns 模板目录的绝对路径
 */
export function getTemplateDir(): string {
  const currentFile = fileURLToPath(import.meta.url)
  const packageRoot = path.resolve(currentFile, '../..')
  return path.join(packageRoot, 'template-vue3')
}

/**
 * 替换文件中的占位符
 * @param filePath 文件路径
 * @param replacements 替换映射
 */
export function replaceInFile(
  filePath: string,
  replacements: TemplateReplacements,
): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`)
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replaceAll(search, replace)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
}
