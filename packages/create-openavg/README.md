# @openavg/create-openavg

快速创建 OpenAVG 项目的脚手架工具。

## 使用

推荐npx：

```bash
npx @openavg/create-openavg my-game
```

```bash
# 使用 pnpm
pnpm create openavg

# 使用 npm
npm create openavg

# 使用 yarn
yarn create openavg
```

## 指定项目名称

```bash
pnpm create openavg my-game
```

## 功能特性

- 🎮 基于 Vue3 + Vite + Pixi.js 的游戏项目模板
- 📦 自动检测并使用合适的包管理器
- ⚡️ 可选的依赖自动安装
- 🎨 开箱即用的游戏菜单系统

## 生成的项目结构

```
my-game/
├── src/
│   ├── components/     # Vue 组件
│   ├── composables/    # 组合式函数
│   ├── api/           # API 接口
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── uno.config.ts
```

## 开发

```bash
cd my-game
pnpm dev
```

## 文档

[OpenAVG 文档](https://github.com/Panzer-Jack/OpenAVG)
