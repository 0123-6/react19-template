import { execSync, spawn } from 'child_process'
import { existsSync, unlinkSync, statSync } from 'fs'

const SERVER = 'root@jiangjiang0123.cn'
const REMOTE_PATH = '/var/front-end/react/'
const LOCAL_OUTPUT = 'dist'
const ARCHIVE_NAME = 'dist.tar.gz'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  brightGreen: '\x1b[92m',
  gray: '\x1b[90m',
}

function log(step: string, message: string, type: 'info' | 'success' | 'warn' = 'info') {
  const msgColor = type === 'success' ? colors.green : type === 'warn' ? colors.yellow : colors.reset
  console.log(`\n${colors.cyan}[${step}]${colors.reset} ${msgColor}${message}${colors.reset}`)
}

function exec(cmd: string, silent = false): string {
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    })
  } catch {
    throw new Error(`命令执行失败: ${cmd}`)
  }
}

async function uploadWithProgress(localFile: string, remotePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fileSize = statSync(localFile).size
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)

    log('上传', `开始上传 ${ARCHIVE_NAME} (${fileSizeMB} MB) 到服务器...`, 'warn')

    const scp = spawn('scp', ['-o', 'Compression=yes', localFile, `${SERVER}:${remotePath}`], {
      stdio: 'inherit',
      shell: true,
    })

    scp.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}✓ 上传完成 (${fileSizeMB} MB)${colors.reset}`)
        resolve()
      } else {
        reject(new Error(`SCP 上传失败，退出码: ${code}`))
      }
    })

    scp.on('error', (err) => {
      reject(err)
    })
  })
}

async function deploy() {
  const startTime = Date.now()

  try {
    // 步骤 1: 构建
    log('1/4', '执行 pnpm build 构建项目...', 'warn')
    exec('pnpm build')
    log('1/4', '✓ 构建完成', 'success')

    if (!existsSync(LOCAL_OUTPUT)) {
      throw new Error('dist 目录不存在，构建可能失败')
    }

    // 步骤 2: 压缩
    log('2/4', '压缩 dist 目录...', 'warn')
    exec(`tar -czf ${ARCHIVE_NAME} -C ${LOCAL_OUTPUT} .`)
    const archiveSize = (statSync(ARCHIVE_NAME).size / 1024 / 1024).toFixed(2)
    log('2/4', `✓ 压缩完成，文件大小: ${archiveSize} MB`, 'success')

    // 步骤 3: 上传
    log('3/4', '上传压缩文件到服务器...', 'warn')
    await uploadWithProgress(ARCHIVE_NAME, REMOTE_PATH)
    log('3/4', '✓ 上传完成', 'success')

    // 步骤 4: 解压并清理
    log('4/4', '服务器解压文件并清理...', 'warn')
    exec(`ssh ${SERVER} "cd ${REMOTE_PATH} && tar -xzf ${ARCHIVE_NAME} && rm -f ${ARCHIVE_NAME}"`, true)
    log('4/4', '✓ 服务器解压完成，已删除压缩文件', 'success')

    if (existsSync(ARCHIVE_NAME)) {
      unlinkSync(ARCHIVE_NAME)
      console.log(`${colors.gray}本地压缩文件已删除${colors.reset}`)
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n${colors.brightGreen}========================================`)
    console.log(`部署成功! 总耗时: ${duration} 秒`)
    console.log(`========================================${colors.reset}\n`)
  } catch (error) {
    if (existsSync(ARCHIVE_NAME)) {
      unlinkSync(ARCHIVE_NAME)
    }
    console.error(`\n${colors.red}✗ 部署失败:${colors.reset}`, error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

deploy()
