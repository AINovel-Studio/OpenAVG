/**
 * 用户配置接口
 */
export interface UserConfig {
  /** 项目名称 */
  projectName: string
  /** 目标目录（完整路径） */
  targetDir: string
  /** 是否安装依赖 */
  shouldInstall: boolean
}

/**
 * 模板替换配置
 */
export interface TemplateReplacements {
  [key: string]: string
}

/**
 * CLI 选项
 */
export interface CliOptions {
  help?: boolean
  version?: boolean
  /** 位置参数 */
  _?: string[]
}
