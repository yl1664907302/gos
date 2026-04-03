#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/java/gateway"
TARGET_JAR_NAME="gateway.jar"
LEGACY_JAR_NAME="gatewa.jar"
DOWNLOAD_URL="{artifact_url}"
RUN_ENV="prod"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
VERSIONED_JAR_NAME="${TARGET_JAR_NAME%.jar}-${TIMESTAMP}.jar"
BACKUP_JAR_NAME="${TARGET_JAR_NAME%.jar}-backup-${TIMESTAMP}.jar"

if [ -z "${DOWNLOAD_URL}" ] || [ "${DOWNLOAD_URL}" = "{artifact_url}" ]; then
  echo "artifact_url 未配置，无法下载新包" >&2
  exit 1
fi

if [ ! -d "${APP_DIR}" ]; then
  echo "应用目录不存在: ${APP_DIR}" >&2
  exit 1
fi

cd "${APP_DIR}"

if [ -f "${TARGET_JAR_NAME}" ]; then
  if [ -L "${TARGET_JAR_NAME}" ]; then
    rm -f "${TARGET_JAR_NAME}"
    echo "已移除旧版本软链: ${TARGET_JAR_NAME}"
  else
    mv "${TARGET_JAR_NAME}" "${BACKUP_JAR_NAME}"
    echo "已备份旧包: ${BACKUP_JAR_NAME}"
  fi
elif [ -f "${LEGACY_JAR_NAME}" ]; then
  mv "${LEGACY_JAR_NAME}" "${BACKUP_JAR_NAME}"
  echo "已备份旧包(兼容旧文件名): ${BACKUP_JAR_NAME}"
else
  echo "未找到历史 jar，跳过备份"
fi

echo "开始下载新包: ${DOWNLOAD_URL}"
wget -O "${VERSIONED_JAR_NAME}" "${DOWNLOAD_URL}"

echo "下载完成，文件信息:"
ls -lh "${VERSIONED_JAR_NAME}"

ln -sfn "${VERSIONED_JAR_NAME}" "${TARGET_JAR_NAME}"
echo "已更新当前运行软链: ${TARGET_JAR_NAME} -> ${VERSIONED_JAR_NAME}"

echo "开始重启应用"
sh jar-start "${TARGET_JAR_NAME}" restart "${RUN_ENV}"

echo "重启命令已执行完成"
