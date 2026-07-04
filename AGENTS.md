# Build Instructions (Continue Fork)

> 适用于 `continuedev/continue` 的 fork 版本 (`danniserena/continue`)
> 对应版本: v1.3.39

## 前置条件

- Node.js >= 20.20.1（推荐使用 nvm-windows 管理版本）
- npm

## 快速开始：完整构建

### 方式一：使用 VSCode Tasks（推荐）

1. 在 VSCode 中打开本目录
2. 运行 Task: **Terminal → Run Task → install-all-dependencies**
3. 完成后按 `F5` 选择 **"Launch extension"** 启动调试

### 方式二：手动构建

#### 1. 安装内部 packages

```powershell
node ./scripts/build-packages.js
```

#### 2. 安装 core 依赖

```powershell
cd core
npm install
cd ..
```

#### 3. 构建 GUI

```powershell
cd gui
npm install
npm run build
cd ..
```

> 如果遇到 TypeScript 类型错误，可以跳过 tsc 直接用 vite build：
>
> ```powershell
> cd gui
> npx vite build
> cd ..
> ```

#### 4. 构建 VSCode 扩展

```powershell
cd extensions\vscode
npm install
npm run prepackage
npm run package
cd ..\..
```

## 开发调试

### F5 Launch Extension

按 `F5` 会自动执行以下任务链（`.vscode/tasks.json`）：

```
vscode-extension:build-with-packages
  ├── continue-packages:build     # 构建 packages
  └── vscode-extension:build
        ├── tsc:watch              # TypeScript 类型检查（后台）
        ├── vscode-extension:continue-ui:build  # prepackage.js
        ├── vscode-extension:esbuild            # esbuild watch（热更新）
        ├── vscode-extension:esbuild-notify
        └── gui:dev                # Vite HMR 开发服务器
```

> **首次启动前需要**：确保 `scripts/prepackage.js` 能正常运行，它会下载 onnxruntime、tree-sitter wasm、sqlite3 等 native bindings。

### 增量开发（跳过完整构建）

如果已经完成过一次完整构建，后续开发可以只启动 watcher：

```powershell
# 终端 1：esbuild watch（VSCode 扩展代码）
cd extensions\vscode
npm run esbuild-watch

# 终端 2：GUI 开发服务器（HMR）
cd gui
npm run dev
```

## 调试配置

| 配置名               | 说明                       |
| -------------------- | -------------------------- |
| **Launch extension** | 调试 VSCode 扩展（主入口） |
| **Core Binary**      | 调试 core 层               |
| **Vite**             | 附加到 GUI 开发服务器      |
| **[Core] Jest Test** | 调试 core 单元测试         |
| **Debug CLI**        | 调试 CLI 命令行工具        |

## 构建输出

```
extensions/vscode/build/continue-<version>.vsix
```

## 平台目标

由当前系统自动检测，也可指定：

```powershell
$env:CONTINUE_VSCODE_TARGET = "win32-x64"      # Windows
$env:CONTINUE_VSCODE_TARGET = "darwin-arm64"    # macOS
$env:CONTINUE_VSCODE_TARGET = "linux-x64"       # Linux
```

## 同步上游

```powershell
# 获取上游更新
git fetch upstream

# 合并到本地 main 分支
git checkout main
git rebase upstream/main
git push origin main
```
