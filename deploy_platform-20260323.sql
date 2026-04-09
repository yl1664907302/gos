
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `deploy_platform` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `deploy_platform`;
DROP TABLE IF EXISTS `agent_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_instance` (
  `id` varchar(64) NOT NULL,
  `agent_code` varchar(100) NOT NULL,
  `name` varchar(120) NOT NULL,
  `environment_code` varchar(120) NOT NULL DEFAULT '',
  `work_dir` varchar(500) NOT NULL,
  `token_ciphertext` text NOT NULL,
  `tags_json` text NOT NULL,
  `hostname` varchar(255) NOT NULL DEFAULT '',
  `host_ip` varchar(120) NOT NULL DEFAULT '',
  `agent_version` varchar(120) NOT NULL DEFAULT '',
  `os` varchar(120) NOT NULL DEFAULT '',
  `arch` varchar(120) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `last_heartbeat_at` bigint NOT NULL DEFAULT '0',
  `current_task_id` varchar(120) NOT NULL DEFAULT '',
  `current_task_name` varchar(255) NOT NULL DEFAULT '',
  `current_task_type` varchar(120) NOT NULL DEFAULT '',
  `current_task_started_at` bigint NOT NULL DEFAULT '0',
  `last_task_status` varchar(20) NOT NULL DEFAULT 'unknown',
  `last_task_summary` varchar(500) NOT NULL DEFAULT '',
  `last_task_finished_at` bigint NOT NULL DEFAULT '0',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_agent_instance_code` (`agent_code`),
  KEY `idx_agent_instance_status` (`status`),
  KEY `idx_agent_instance_env` (`environment_code`),
  KEY `idx_agent_instance_heartbeat` (`last_heartbeat_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `agent_script`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_script` (
  `id` varchar(64) NOT NULL,
  `name` varchar(160) NOT NULL,
  `description` varchar(500) NOT NULL DEFAULT '',
  `task_type` varchar(50) NOT NULL,
  `shell_type` varchar(20) NOT NULL DEFAULT 'sh',
  `script_path` varchar(500) NOT NULL DEFAULT '',
  `script_text` mediumtext NOT NULL,
  `created_by` varchar(100) NOT NULL DEFAULT '',
  `updated_by` varchar(100) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_agent_script_type_created` (`task_type`,`created_at`),
  KEY `idx_agent_script_name_created` (`name`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `agent_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_task` (
  `id` varchar(64) NOT NULL,
  `agent_id` varchar(64) NOT NULL,
  `agent_code` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `task_mode` varchar(20) NOT NULL DEFAULT 'temporary',
  `task_type` varchar(50) NOT NULL,
  `shell_type` varchar(20) NOT NULL DEFAULT 'sh',
  `work_dir` varchar(500) NOT NULL,
  `script_id` varchar(64) NOT NULL DEFAULT '',
  `script_name` varchar(200) NOT NULL DEFAULT '',
  `script_path` varchar(500) NOT NULL DEFAULT '',
  `script_text` mediumtext NOT NULL,
  `variables_json` mediumtext NOT NULL,
  `timeout_sec` int NOT NULL DEFAULT '300',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `claimed_at` bigint NOT NULL DEFAULT '0',
  `started_at` bigint NOT NULL DEFAULT '0',
  `finished_at` bigint NOT NULL DEFAULT '0',
  `exit_code` int NOT NULL DEFAULT '0',
  `stdout_text` mediumtext NOT NULL,
  `stderr_text` mediumtext NOT NULL,
  `failure_reason` text NOT NULL,
  `run_count` int NOT NULL DEFAULT '0',
  `success_count` int NOT NULL DEFAULT '0',
  `failure_count` int NOT NULL DEFAULT '0',
  `last_run_status` varchar(20) NOT NULL DEFAULT '',
  `last_run_summary` text NOT NULL,
  `created_by` varchar(100) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_agent_task_agent_status` (`agent_id`,`status`),
  KEY `idx_agent_task_status_created` (`status`,`created_at`),
  KEY `idx_agent_task_agent_created` (`agent_id`,`created_at`),
  KEY `idx_agent_task_agent_mode_status` (`agent_id`,`task_mode`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `app_key` varchar(128) NOT NULL,
  `project_id` varchar(64) NOT NULL DEFAULT '',
  `repo_url` text NOT NULL,
  `description` text NOT NULL,
  `owner_user_id` varchar(64) NOT NULL DEFAULT '',
  `owner` varchar(128) NOT NULL,
  `status` varchar(32) NOT NULL,
  `artifact_type` varchar(64) NOT NULL,
  `language` varchar(64) NOT NULL,
  `gitops_branch_mappings` json DEFAULT NULL,
  `release_branches` json DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_application_key` (`app_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `argocd_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `argocd_application` (
  `id` varchar(64) NOT NULL,
  `argocd_instance_id` varchar(64) NOT NULL DEFAULT '',
  `instance_code` varchar(100) NOT NULL DEFAULT '',
  `instance_name` varchar(120) NOT NULL DEFAULT '',
  `cluster_name` varchar(120) NOT NULL DEFAULT '',
  `instance_base_url` varchar(500) NOT NULL DEFAULT '',
  `app_name` varchar(200) NOT NULL,
  `project` varchar(100) NOT NULL DEFAULT '',
  `repo_url` varchar(500) NOT NULL DEFAULT '',
  `source_path` varchar(500) NOT NULL DEFAULT '',
  `target_revision` varchar(200) NOT NULL DEFAULT '',
  `dest_server` varchar(500) NOT NULL DEFAULT '',
  `dest_namespace` varchar(200) NOT NULL DEFAULT '',
  `sync_status` varchar(50) NOT NULL DEFAULT '',
  `health_status` varchar(50) NOT NULL DEFAULT '',
  `operation_phase` varchar(50) NOT NULL DEFAULT '',
  `argocd_url` varchar(500) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `raw_meta` json DEFAULT NULL,
  `last_synced_at` bigint NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_argocd_application_instance_name` (`argocd_instance_id`,`app_name`),
  KEY `idx_argocd_project` (`project`),
  KEY `idx_argocd_sync_status` (`sync_status`),
  KEY `idx_argocd_health_status` (`health_status`),
  KEY `idx_argocd_status` (`status`),
  KEY `idx_argocd_application_instance` (`argocd_instance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `argocd_env_binding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `argocd_env_binding` (
  `id` varchar(64) NOT NULL,
  `env_code` varchar(64) NOT NULL,
  `argocd_instance_id` varchar(64) NOT NULL,
  `priority` int NOT NULL DEFAULT '1',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_argocd_env_binding_env` (`env_code`),
  KEY `idx_argocd_env_binding_instance` (`argocd_instance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `argocd_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `argocd_instance` (
  `id` varchar(64) NOT NULL,
  `instance_code` varchar(100) NOT NULL,
  `name` varchar(120) NOT NULL,
  `base_url` varchar(500) NOT NULL,
  `insecure_skip_verify` tinyint(1) NOT NULL DEFAULT '0',
  `auth_mode` varchar(32) NOT NULL DEFAULT '',
  `token_ciphertext` text NOT NULL,
  `username` varchar(120) NOT NULL DEFAULT '',
  `password_ciphertext` text NOT NULL,
  `gitops_instance_id` varchar(64) NOT NULL DEFAULT '',
  `cluster_name` varchar(120) NOT NULL DEFAULT '',
  `default_namespace` varchar(120) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `health_status` varchar(32) NOT NULL DEFAULT '',
  `last_check_at` bigint NOT NULL DEFAULT '0',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_argocd_instance_code` (`instance_code`),
  UNIQUE KEY `uk_argocd_instance_base_url` (`base_url`),
  KEY `idx_argocd_instance_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `executor_param_def`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `executor_param_def` (
  `id` varchar(64) NOT NULL,
  `pipeline_id` varchar(64) NOT NULL,
  `executor_type` varchar(50) NOT NULL,
  `executor_param_name` varchar(100) NOT NULL,
  `param_key` varchar(100) NOT NULL DEFAULT '',
  `param_type` varchar(50) NOT NULL,
  `single_select` tinyint(1) NOT NULL DEFAULT '0',
  `required` tinyint(1) NOT NULL,
  `default_value` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  `visible` tinyint(1) NOT NULL,
  `editable` tinyint(1) NOT NULL,
  `source_from` varchar(50) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'active',
  `raw_meta` json DEFAULT NULL,
  `sort_no` int NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pipeline_param_unique` (`pipeline_id`,`executor_type`,`executor_param_name`),
  KEY `idx_pipeline_param_pipeline_sort` (`pipeline_id`,`sort_no`),
  KEY `idx_pipeline_param_param_key` (`param_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `gitops_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gitops_instance` (
  `id` varchar(64) NOT NULL,
  `instance_code` varchar(100) NOT NULL,
  `name` varchar(120) NOT NULL,
  `local_root` varchar(500) NOT NULL,
  `default_branch` varchar(120) NOT NULL DEFAULT 'master',
  `username` varchar(120) NOT NULL DEFAULT '',
  `password_ciphertext` text NOT NULL,
  `token_ciphertext` text NOT NULL,
  `author_name` varchar(120) NOT NULL DEFAULT '',
  `author_email` varchar(200) NOT NULL DEFAULT '',
  `commit_message_template` text NOT NULL,
  `command_timeout_sec` int NOT NULL DEFAULT '30',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gitops_instance_code` (`instance_code`),
  UNIQUE KEY `uk_gitops_instance_local_root` (`local_root`),
  KEY `idx_gitops_instance_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notification_hook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_hook` (
  `id` varchar(64) NOT NULL,
  `name` varchar(200) NOT NULL,
  `source_id` varchar(64) NOT NULL,
  `markdown_template_id` varchar(64) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `remark` text NOT NULL,
  `created_by` varchar(128) NOT NULL,
  `updated_by` varchar(128) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notification_hook_name` (`name`),
  KEY `idx_notification_hook_source` (`source_id`),
  KEY `idx_notification_hook_template` (`markdown_template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notification_markdown_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_markdown_template` (
  `id` varchar(64) NOT NULL,
  `name` varchar(200) NOT NULL,
  `title_template` text NOT NULL,
  `body_template` text NOT NULL,
  `conditions_json` longtext NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `remark` text NOT NULL,
  `created_by` varchar(128) NOT NULL,
  `updated_by` varchar(128) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notification_markdown_template_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notification_source`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_source` (
  `id` varchar(64) NOT NULL,
  `name` varchar(200) NOT NULL,
  `source_type` varchar(32) NOT NULL,
  `webhook_url` text NOT NULL,
  `verification_param` text NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `remark` text NOT NULL,
  `created_by` varchar(128) NOT NULL,
  `updated_by` varchar(128) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_notification_source_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pipeline_bindings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline_bindings` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `application_id` varchar(64) NOT NULL,
  `application_name` varchar(128) NOT NULL DEFAULT '',
  `binding_type` varchar(32) NOT NULL DEFAULT 'ci',
  `provider` varchar(32) NOT NULL DEFAULT 'jenkins',
  `pipeline_id` varchar(64) NOT NULL,
  `external_ref` varchar(255) NOT NULL DEFAULT '',
  `trigger_mode` varchar(32) NOT NULL,
  `status` varchar(32) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_binding_app_pipeline` (`application_id`,`pipeline_id`),
  UNIQUE KEY `uq_binding_app_type` (`application_id`,`binding_type`),
  KEY `idx_binding_app_created_at` (`application_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pipelines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipelines` (
  `id` varchar(64) NOT NULL,
  `provider` varchar(32) NOT NULL,
  `job_full_name` varchar(255) NOT NULL,
  `job_name` varchar(255) NOT NULL,
  `job_url` text NOT NULL,
  `description` text NOT NULL,
  `credential_ref` varchar(255) NOT NULL,
  `default_branch` varchar(255) NOT NULL,
  `status` varchar(32) NOT NULL,
  `last_verified_at` bigint DEFAULT NULL,
  `last_synced_at` bigint NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pipeline_provider_full_name` (`provider`,`job_full_name`),
  KEY `idx_pipeline_status_updated_at` (`status`,`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `platform_param_dict`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform_param_dict` (
  `id` varchar(64) NOT NULL,
  `param_key` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `param_type` varchar(50) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `gitops_locator` tinyint(1) NOT NULL DEFAULT '0',
  `cd_self_fill` tinyint(1) NOT NULL DEFAULT '0',
  `builtin` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_platform_param_key` (`param_key`),
  KEY `idx_platform_param_status_updated_at` (`status`,`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `project_key` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(32) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_key` (`project_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_execution_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_execution_lock` (
  `id` varchar(64) NOT NULL,
  `lock_scope` varchar(32) NOT NULL,
  `lock_key` varchar(500) NOT NULL,
  `application_id` varchar(64) NOT NULL DEFAULT '',
  `env_code` varchar(64) NOT NULL DEFAULT '',
  `release_order_id` varchar(64) NOT NULL DEFAULT '',
  `release_order_no` varchar(64) NOT NULL DEFAULT '',
  `status` varchar(32) NOT NULL DEFAULT 'active',
  `owner_type` varchar(32) NOT NULL DEFAULT 'release_order',
  `created_at` bigint NOT NULL,
  `expired_at` bigint DEFAULT NULL,
  `released_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_release_execution_lock_key_status` (`lock_key`,`status`),
  KEY `idx_release_execution_lock_order` (`release_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order` (
  `id` varchar(64) NOT NULL,
  `order_no` varchar(64) NOT NULL,
  `previous_order_no` varchar(64) NOT NULL DEFAULT '',
  `operation_type` varchar(32) NOT NULL DEFAULT 'deploy',
  `source_order_id` varchar(64) NOT NULL DEFAULT '',
  `source_order_no` varchar(64) NOT NULL DEFAULT '',
  `is_concurrent` tinyint(1) NOT NULL DEFAULT '0',
  `concurrent_batch_no` varchar(64) NOT NULL DEFAULT '',
  `concurrent_batch_seq` int NOT NULL DEFAULT '0',
  `application_id` varchar(64) NOT NULL,
  `application_name` varchar(100) NOT NULL DEFAULT '',
  `template_id` varchar(64) NOT NULL DEFAULT '',
  `template_name` varchar(128) NOT NULL DEFAULT '',
  `binding_id` varchar(64) NOT NULL,
  `pipeline_id` varchar(64) NOT NULL DEFAULT '',
  `env_code` varchar(50) NOT NULL,
  `son_service` varchar(200) NOT NULL DEFAULT '',
  `git_ref` varchar(200) NOT NULL DEFAULT '',
  `image_tag` varchar(200) NOT NULL DEFAULT '',
  `trigger_type` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `approval_required` tinyint(1) NOT NULL DEFAULT '0',
  `approval_mode` varchar(32) NOT NULL DEFAULT '',
  `approval_approver_ids_json` text NOT NULL,
  `approval_approver_names_json` text NOT NULL,
  `approved_at` bigint DEFAULT NULL,
  `approved_by` varchar(64) NOT NULL DEFAULT '',
  `rejected_at` bigint DEFAULT NULL,
  `rejected_by` varchar(64) NOT NULL DEFAULT '',
  `rejected_reason` varchar(1000) NOT NULL DEFAULT '',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `creator_user_id` varchar(64) NOT NULL DEFAULT '',
  `triggered_by` varchar(64) NOT NULL DEFAULT '',
  `started_at` bigint DEFAULT NULL,
  `finished_at` bigint DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_order_no` (`order_no`),
  KEY `idx_release_order_application` (`application_id`),
  KEY `idx_release_order_binding` (`binding_id`),
  KEY `idx_release_order_created_at` (`created_at`),
  KEY `idx_release_order_batch` (`concurrent_batch_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_approval_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_approval_record` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `action` varchar(32) NOT NULL,
  `operator_user_id` varchar(64) NOT NULL DEFAULT '',
  `operator_name` varchar(100) NOT NULL DEFAULT '',
  `comment` varchar(1000) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_release_order_approval_record_order_created` (`release_order_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_deploy_snapshot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_deploy_snapshot` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `provider` varchar(32) NOT NULL DEFAULT '',
  `gitops_type` varchar(32) NOT NULL DEFAULT '',
  `argocd_instance_id` varchar(64) NOT NULL DEFAULT '',
  `gitops_instance_id` varchar(64) NOT NULL DEFAULT '',
  `argocd_app_name` varchar(255) NOT NULL DEFAULT '',
  `repo_url` varchar(500) NOT NULL DEFAULT '',
  `branch` varchar(128) NOT NULL DEFAULT '',
  `source_path` varchar(255) NOT NULL DEFAULT '',
  `env_code` varchar(64) NOT NULL DEFAULT '',
  `snapshot_payload_json` longtext NOT NULL,
  `created_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_order_snapshot_order` (`release_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_execution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_execution` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `pipeline_scope` varchar(20) NOT NULL,
  `binding_id` varchar(64) NOT NULL,
  `binding_name` varchar(128) NOT NULL DEFAULT '',
  `provider` varchar(32) NOT NULL DEFAULT '',
  `pipeline_id` varchar(64) NOT NULL DEFAULT '',
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `queue_url` varchar(500) NOT NULL DEFAULT '',
  `build_url` varchar(500) NOT NULL DEFAULT '',
  `external_run_id` varchar(128) NOT NULL DEFAULT '',
  `started_at` bigint DEFAULT NULL,
  `finished_at` bigint DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_order_execution_scope` (`release_order_id`,`pipeline_scope`),
  KEY `idx_release_order_execution_order` (`release_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_param` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `pipeline_scope` varchar(20) NOT NULL DEFAULT '',
  `binding_id` varchar(64) NOT NULL DEFAULT '',
  `param_key` varchar(100) NOT NULL,
  `executor_param_name` varchar(100) NOT NULL DEFAULT '',
  `param_value` varchar(1000) NOT NULL DEFAULT '',
  `value_source` varchar(50) NOT NULL,
  `created_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_release_order_param_order` (`release_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_pipeline_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_pipeline_stage` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `execution_id` varchar(64) NOT NULL DEFAULT '',
  `pipeline_scope` varchar(32) NOT NULL DEFAULT '',
  `executor_type` varchar(32) NOT NULL DEFAULT '',
  `stage_key` varchar(128) NOT NULL,
  `stage_name` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `raw_status` varchar(64) NOT NULL DEFAULT '',
  `sort_no` int NOT NULL DEFAULT '0',
  `duration_millis` bigint NOT NULL DEFAULT '0',
  `started_at` bigint DEFAULT NULL,
  `finished_at` bigint DEFAULT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_order_pipeline_stage_key` (`release_order_id`,`executor_type`,`pipeline_scope`,`stage_key`),
  KEY `idx_release_order_pipeline_stage_order_sort` (`release_order_id`,`pipeline_scope`,`sort_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_order_step`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_order_step` (
  `id` varchar(64) NOT NULL,
  `release_order_id` varchar(64) NOT NULL,
  `step_scope` varchar(20) NOT NULL DEFAULT 'global',
  `execution_id` varchar(64) NOT NULL DEFAULT '',
  `step_code` varchar(100) NOT NULL,
  `step_name` varchar(200) NOT NULL DEFAULT '',
  `status` varchar(50) NOT NULL,
  `message` varchar(1000) NOT NULL DEFAULT '',
  `sort_no` int NOT NULL DEFAULT '0',
  `started_at` bigint DEFAULT NULL,
  `finished_at` bigint DEFAULT NULL,
  `created_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_order_step_code` (`release_order_id`,`step_code`),
  KEY `idx_release_order_step_order_sort` (`release_order_id`,`sort_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_template` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `application_id` varchar(64) NOT NULL,
  `application_name` varchar(128) NOT NULL DEFAULT '',
  `binding_id` varchar(64) NOT NULL,
  `binding_name` varchar(128) NOT NULL DEFAULT '',
  `binding_type` varchar(32) NOT NULL DEFAULT '',
  `gitops_type` varchar(32) NOT NULL DEFAULT '',
  `status` varchar(32) NOT NULL DEFAULT 'active',
  `approval_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `approval_mode` varchar(32) NOT NULL DEFAULT '',
  `approval_approver_ids_json` text NOT NULL,
  `approval_approver_names_json` text NOT NULL,
  `remark` varchar(500) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_template_binding_name` (`binding_id`,`name`),
  KEY `idx_release_template_application` (`application_id`),
  KEY `idx_release_template_binding` (`binding_id`),
  KEY `idx_release_template_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_template_binding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_template_binding` (
  `id` varchar(64) NOT NULL,
  `template_id` varchar(64) NOT NULL,
  `pipeline_scope` varchar(20) NOT NULL,
  `binding_id` varchar(64) NOT NULL,
  `binding_name` varchar(128) NOT NULL DEFAULT '',
  `provider` varchar(32) NOT NULL DEFAULT '',
  `pipeline_id` varchar(64) NOT NULL DEFAULT '',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `sort_no` int NOT NULL DEFAULT '1',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_template_scope` (`template_id`,`pipeline_scope`),
  KEY `idx_release_template_binding_template` (`template_id`),
  KEY `idx_release_template_binding_binding` (`binding_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_template_gitops_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_template_gitops_rule` (
  `id` varchar(64) NOT NULL,
  `template_id` varchar(64) NOT NULL,
  `pipeline_scope` varchar(20) NOT NULL DEFAULT 'cd',
  `source_param_key` varchar(100) NOT NULL,
  `source_param_name` varchar(100) NOT NULL DEFAULT '',
  `source_from` varchar(32) NOT NULL DEFAULT '',
  `locator_param_key` varchar(100) NOT NULL DEFAULT '',
  `locator_param_name` varchar(100) NOT NULL DEFAULT '',
  `file_path_template` varchar(255) NOT NULL,
  `document_kind` varchar(100) NOT NULL DEFAULT '',
  `document_name` varchar(150) NOT NULL DEFAULT '',
  `target_path` varchar(255) NOT NULL,
  `value_template` varchar(255) NOT NULL DEFAULT '',
  `sort_no` int NOT NULL DEFAULT '0',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_release_template_gitops_rule_template_sort` (`template_id`,`sort_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_template_hook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_template_hook` (
  `id` varchar(64) NOT NULL,
  `template_id` varchar(64) NOT NULL,
  `hook_type` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `trigger_condition` varchar(32) NOT NULL DEFAULT 'on_success',
  `failure_policy` varchar(32) NOT NULL DEFAULT 'warn_only',
  `target_id` varchar(64) NOT NULL DEFAULT '',
  `target_name` varchar(255) NOT NULL DEFAULT '',
  `webhook_method` varchar(16) NOT NULL DEFAULT '',
  `webhook_url` varchar(500) NOT NULL DEFAULT '',
  `webhook_body` text NOT NULL,
  `note` varchar(500) NOT NULL DEFAULT '',
  `sort_no` int NOT NULL DEFAULT '0',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_release_template_hook_template_sort` (`template_id`,`sort_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `release_template_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `release_template_param` (
  `id` varchar(64) NOT NULL,
  `template_id` varchar(64) NOT NULL,
  `template_binding_id` varchar(64) NOT NULL DEFAULT '',
  `pipeline_scope` varchar(20) NOT NULL DEFAULT '',
  `binding_id` varchar(64) NOT NULL DEFAULT '',
  `executor_param_def_id` varchar(64) NOT NULL,
  `param_key` varchar(100) NOT NULL,
  `param_name` varchar(100) NOT NULL DEFAULT '',
  `executor_param_name` varchar(100) NOT NULL DEFAULT '',
  `value_source` varchar(32) NOT NULL DEFAULT 'release_input',
  `source_param_key` varchar(100) NOT NULL DEFAULT '',
  `source_param_name` varchar(100) NOT NULL DEFAULT '',
  `fixed_value` varchar(500) NOT NULL DEFAULT '',
  `required` tinyint(1) NOT NULL DEFAULT '0',
  `sort_no` int NOT NULL DEFAULT '0',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_release_template_param_unique` (`template_id`,`executor_param_def_id`),
  KEY `idx_release_template_param_template_sort` (`template_id`,`sort_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sys_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_permission` (
  `id` varchar(64) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_permission_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user` (
  `id` varchar(64) NOT NULL,
  `username` varchar(100) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  `role` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `password_hash` varchar(255) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sys_user_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sys_user_param_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_param_permission` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `param_key` varchar(100) NOT NULL,
  `application_id` varchar(64) NOT NULL DEFAULT '',
  `can_view` tinyint(1) NOT NULL DEFAULT '0',
  `can_edit` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_supp_unique` (`user_id`,`param_key`,`application_id`),
  KEY `idx_supp_user` (`user_id`),
  KEY `idx_supp_param` (`param_key`),
  KEY `idx_supp_app` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sys_user_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_permission` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `permission_code` varchar(100) NOT NULL,
  `scope_type` varchar(30) NOT NULL DEFAULT 'global',
  `scope_value` varchar(200) NOT NULL DEFAULT '',
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` bigint NOT NULL,
  `updated_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sup_unique` (`user_id`,`permission_code`,`scope_type`,`scope_value`),
  KEY `idx_sup_user` (`user_id`),
  KEY `idx_sup_code` (`permission_code`),
  KEY `idx_sup_scope` (`scope_type`,`scope_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sys_user_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_user_session` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `access_token` varchar(512) NOT NULL,
  `expired_at` bigint NOT NULL,
  `client_ip` varchar(64) NOT NULL DEFAULT '',
  `user_agent` varchar(300) NOT NULL DEFAULT '',
  `created_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sus_token` (`access_token`),
  KEY `idx_sus_user` (`user_id`),
  KEY `idx_sus_expired` (`expired_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

