#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="{project_name}"
APP_DIR="/home/java/${PROJECT_NAME}"
TARGET_JAR_NAME="${PROJECT_NAME}-1.0.1.jar"
IMAGE_VERSION="{image_version}"
DOWNLOAD_BASE_URL="https://gc-oa.oss-cn-shanghai.aliyuncs.com/tempUpdate"
RUN_ENV="prod"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
BACKUP_JAR_NAME="${TARGET_JAR_NAME%.jar}-backup-${TIMESTAMP}.jar"
DOWNLOADED_JAR_NAME="${PROJECT_NAME}-${IMAGE_VERSION}.jar"
DOWNLOAD_URL="${DOWNLOAD_BASE_URL}/${DOWNLOADED_JAR_NAME}"

if [ -z "${PROJECT_NAME}" ] || [ "${PROJECT_NAME}" = "{project_name}" ]; then
  echo "project_name 未配置，无法定位应用目录和目标包名" >&2
  exit 1
fi

if [ -z "${IMAGE_VERSION}" ] || [ "${IMAGE_VERSION}" = "{image_version}" ]; then
  echo "image_version 未配置，无法生成下载包名" >&2
  exit 1
fi

if [ ! -d "${APP_DIR}" ]; then
  echo "应用目录不存在: ${APP_DIR}" >&2
  exit 1
fi

cd "${APP_DIR}"
echo "已切换到目录: ${APP_DIR}"

if [ -f "${TARGET_JAR_NAME}" ]; then
  mv "${TARGET_JAR_NAME}" "${BACKUP_JAR_NAME}"
  echo "已备份旧包: ${BACKUP_JAR_NAME}"
else
  echo "未找到旧包，跳过备份: ${TARGET_JAR_NAME}"
fi

echo "开始下载新包: ${DOWNLOAD_URL}"
wget -O "${DOWNLOADED_JAR_NAME}" "${DOWNLOAD_URL}"
echo "下载完成: ${DOWNLOADED_JAR_NAME}"

mv "${DOWNLOADED_JAR_NAME}" "${TARGET_JAR_NAME}"
echo "已替换新包: ${TARGET_JAR_NAME}"

echo "开始重启应用"
sh jar-start "${TARGET_JAR_NAME}" restart "${RUN_ENV}"
echo "重启完成"
