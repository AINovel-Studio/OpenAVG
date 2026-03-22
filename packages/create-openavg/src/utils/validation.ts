/**
 * 验证项目名称
 * @param value 项目名称
 * @returns 错误信息，如果验证通过则返回 undefined
 */
export function validateProjectName(value: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return '项目名称不能为空'
  }

  // npm 包名规则：支持 @scope/name 格式
  if (!/^[a-z0-9-_@/]+$/.test(value)) {
    return '项目名称只能包含小写字母、数字、连字符、下划线和 @/'
  }

  if (value.length > 214) {
    return '项目名称不能超过 214 个字符'
  }

  return undefined
}
