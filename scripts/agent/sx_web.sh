#!/usr/bin/env bash
set -euo pipefail

APP_NAME="notarization-js-notarybusiness2"
APP_DIR="/home/web/${APP_NAME}"
BACKUP_BASE_DIR="/home/web"

IMAGE_VERSION="{image_version}"
DOWNLOAD_BASE_URL="https://gc-oa.oss-cn-shanghai.aliyuncs.com/tempUpdate"
DOWNLOAD_OBJECT_PATH="notarybusiness-${IMAGE_VERSION}.zip"
DOWNLOADED_ZIP_NAME="notarybusiness-${IMAGE_VERSION}.zip"
DOWNLOAD_URL="${DOWNLOAD_BASE_URL}/${DOWNLOAD_OBJECT_PATH}"

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
BACKUP_FILE_NAME="${APP_NAME}-backup-${TIMESTAMP}.zip"
BACKUP_FILE_PATH="${BACKUP_BASE_DIR}/${BACKUP_FILE_NAME}"

echo "================= 参数信息 ================="
echo "APP_NAME             = ${APP_NAME}"
echo "APP_DIR              = ${APP_DIR}"
echo "BACKUP_FILE_PATH     = ${BACKUP_FILE_PATH}"
echo "IMAGE_VERSION        = ${IMAGE_VERSION}"
echo "DOWNLOAD_URL         = ${DOWNLOAD_URL}"
echo "TIMESTAMP            = ${TIMESTAMP}"
echo "==========================================="

if [ ! -d "${APP_DIR}" ]; then
  echo "❌ 应用目录不存在: ${APP_DIR}"
  exit 1
fi

echo "📦 开始备份目录为 zip"
cd "/home/web"

zip -q -r "${BACKUP_FILE_PATH}" "${APP_NAME}"
echo "✅ 备份完成: ${BACKUP_FILE_PATH}"

cd "${APP_DIR}"
echo "📂 已切换到目录: ${APP_DIR}"

echo "⬇️ 开始下载前端压缩包"
echo "URL: ${DOWNLOAD_URL}"
wget -nv -O "${DOWNLOADED_ZIP_NAME}" "${DOWNLOAD_URL}"

echo "✅ 下载完成: ${DOWNLOADED_ZIP_NAME}"
ls -lh "${DOWNLOADED_ZIP_NAME}"

echo "🧹 清理旧文件（保留 zip）"
find . -mindepth 1 \
  ! -name "${DOWNLOADED_ZIP_NAME}" \
  -exec rm -rf {} +

echo "📂 解压新包"
unzip -oq "${DOWNLOADED_ZIP_NAME}" -d "${APP_DIR}"

echo "🗑️ 删除下载包"
rm -f "${DOWNLOADED_ZIP_NAME}"

echo "✅ 前端发布完成"