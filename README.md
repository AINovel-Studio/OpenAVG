# OpenAVG

一个基于 Vue3 + Pixi.js 的通用冒险游戏引擎，可以制作 Galgame 和 RPG。

[在线演示](https://demo.openavg.panzer-jack.cn/) | [引擎文档（TODO）](https://doc.openavg.panzer-jack.cn/)

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/dace964a-35e4-491f-ba03-0746a6e10893" />

## 快速开始

使用脚手架快速创建项目：

```bash
npx @openavg/create-openavg my-game
cd my-game
pnpm dev
```

## 功能特性

- 🎮 完整的游戏场景管理系统
- 🎵 音频系统（BGM、音效）
- 💾 存档/读档系统
- 🎨 基于 Pixi.js 的高性能渲染
- 📝 对话和剧情控制系统
- 🎬 丰富的游戏菜单组件

## 项目结构

```
OpenAVG/
├── packages/
│   ├── core/              # 引擎核心库
│   ├── playground/        # 开发测试环境
│   └── create-openavg/    # 项目脚手架
```

## 开发

### 系统要求

- Node.js >= 22.x
- pnpm >= 9.x

### 安装依赖

```bash
git clone https://github.com/Panzer-Jack/OpenAVG.git
cd OpenAVG
pnpm install
```

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建游戏
pnpm build:game

# 构建引擎核心
pnpm build:core
```

## 文档

详细文档正在完善中，敬请期待。

## License

MIT
