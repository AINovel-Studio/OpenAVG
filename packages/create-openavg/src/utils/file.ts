import fs from 'node:fs'
import path from 'node:path'
import * as prompts from '@clack/prompts'

/**
 * 确保目录存在，如果不存在则创建
 * @param dir 目录路径
 */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * 递归复制模板目录
 * @param srcDir 源目录
 * @param destDir 目标目录
 */
export function copyTemplate(srcDir: string, destDir: string): void {
  const files = fs.readdirSync(srcDir)

  for (const file of files) {
    // 跳过不需要的文件
    if (shouldSkipFile(file))
      continue

    const srcPath = path.join(srcDir, file)
    // 将 _gitignore 重命名为 .gitignore
    const destFileName = file === '_gitignore' ? '.gitignore' : file
    const destPath = path.join(destDir, destFileName)

    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      ensureDir(destPath)
      copyTemplate(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * 处理已存在的目录
 * @param dir 目录路径
 * @returns 是否继续操作
 */
export async function handleExistingDir(dir: string): Promise<boolean> {
  if (isEmpty(dir)) {
    return true
  }

  const action = await prompts.select({
    message: `目录 "${dir}" 已存在且不为空，请选择操作：`,
    options: [
      { label: '取消操作', value: 'cancel' },
      { label: '清空目录并继续', value: 'overwrite' },
      { label: '忽略并继续（可能导致文件冲突）', value: 'ignore' },
    ],
  })

  if (prompts.isCancel(action) || action === 'cancel') {
    return false
  }

  if (action === 'overwrite') {
    emptyDir(dir)
  }

  return true
}

/**
 * 检查目录是否为空
 * @param dir 目录路径
 * @returns 是否为空
 */
export function isEmpty(dir: string): boolean {
  const files = fs.readdirSync(dir)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

/**
 * 清空目录
 * @param dir 目录路径
 */
export function emptyDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    return
  }

  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

/**
 * 判断是否应该跳过文件
 * @param file 文件名
 * @returns 是否跳过
 */
function shouldSkipFile(file: string): boolean {
  const skipList = ['node_modules', '.git', 'dist', 'pnpm-lock.yaml']
  return skipList.includes(file)
}
