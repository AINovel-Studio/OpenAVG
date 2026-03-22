# @openavg/core

OpenAVG 游戏引擎核心库。

## 功能

- 🎮 游戏场景管理
- 🎵 音频系统（BGM、音效）
- 💾 存档系统
- 🎨 Pixi.js 渲染引擎集成
- 📝 对话系统
- 🎬 剧情控制

## 安装

```bash
pnpm add @openavg/core
```

## 基础使用

```typescript
import { GameManager } from '@openavg/core'

const game = new GameManager({
  container: document.getElementById('app'),
  width: 1920,
  height: 1080,
})

game.start()
```

## 文档

详细文档请访问 [OpenAVG 文档](https://github.com/Panzer-Jack/OpenAVG)
