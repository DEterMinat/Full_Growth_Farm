-- Growth Farm Database Schema
-- Generated for GrowthFarm API
-- All tables use _GrowthFarm suffix for consistency

-- Create database (if not exists)
-- CREATE DATABASE it_std6630202261;
-- USE it_std6630202261;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL UNIQUE,
  `username` varchar(100) UNIQUE,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phoneNumber` varchar(20),
  `profileImage` varchar(500),
  `role` enum('FARMER', 'BUYER', 'ADMIN', 'MANAGER') DEFAULT 'FARMER',
  `isActive` boolean DEFAULT true,
  `dateOfBirth` date,
  `address` text,
  `nationality` varchar(50),
  `idCard` varchar(20),
  `bankAccount` json,
  `preferences` json,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_username` (`username`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Farms Table
CREATE TABLE IF NOT EXISTS `farms_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `location` varchar(500),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8),
  `size` decimal(10,2),
  `sizeUnit` enum('SQUARE_METER', 'SQUARE_KILOMETER', 'ACRE', 'HECTARE') DEFAULT 'SQUARE_METER',
  `farmType` enum('ORGANIC', 'CONVENTIONAL', 'HYDROPONIC', 'GREENHOUSE', 'MIXED') DEFAULT 'CONVENTIONAL',
  `status` enum('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
  `establishedDate` date,
  `certifications` json,
  `images` json,
  `contactInfo` json,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_farm_type` (`farmType`),
  INDEX `idx_status` (`status`),
  INDEX `idx_location` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Farm Zones Table
CREATE TABLE IF NOT EXISTS `farm_zones_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmId` int(11) NOT NULL,
  `managerId` int(11),
  `name` varchar(255) NOT NULL,
  `description` text,
  `zoneType` enum('CROP', 'LIVESTOCK', 'STORAGE', 'PROCESSING', 'GREENHOUSE', 'FIELD', 'OTHER') DEFAULT 'CROP',
  `size` decimal(10,2),
  `sizeUnit` enum('SQUARE_METER', 'SQUARE_KILOMETER', 'ACRE', 'HECTARE') DEFAULT 'SQUARE_METER',
  `currentCrop` varchar(255),
  `soilType` varchar(100),
  `irrigationSystem` enum('DRIP', 'SPRINKLER', 'FLOOD', 'MANUAL', 'NONE') DEFAULT 'MANUAL',
  `sensors` json,
  `equipment` json,
  `status` enum('ACTIVE', 'PREPARING', 'HARVESTING', 'RESTING', 'MAINTENANCE') DEFAULT 'ACTIVE',
  `plantingDate` date,
  `expectedHarvestDate` date,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`managerId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE SET NULL,
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_manager_id` (`managerId`),
  INDEX `idx_zone_type` (`zoneType`),
  INDEX `idx_current_crop` (`currentCrop`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Marketplace Products Table
CREATE TABLE IF NOT EXISTS `marketplace_products_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sellerId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` enum('CROPS', 'LIVESTOCK', 'EQUIPMENT', 'SEEDS', 'FERTILIZER', 'TOOLS', 'SERVICES', 'OTHER') DEFAULT 'CROPS',
  `subcategory` varchar(100),
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'THB',
  `unit` enum('KG', 'GRAM', 'TON', 'PIECE', 'LITER', 'SQUARE_METER', 'HECTARE', 'HOUR', 'DAY', 'OTHER') DEFAULT 'KG',
  `quantity` decimal(10,2) NOT NULL,
  `minOrderQuantity` decimal(10,2) DEFAULT 1,
  `maxOrderQuantity` decimal(10,2),
  `images` json,
  `specifications` json,
  `harvestDate` date,
  `expirationDate` date,
  `organicCertified` boolean DEFAULT false,
  `location` varchar(500),
  `shippingOptions` json,
  `tags` json,
  `status` enum('AVAILABLE', 'SOLD_OUT', 'RESERVED', 'INACTIVE') DEFAULT 'AVAILABLE',
  `viewCount` int(11) DEFAULT 0,
  `favoriteCount` int(11) DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sellerId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_seller_id` (`sellerId`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_price` (`price`),
  INDEX `idx_harvest_date` (`harvestDate`),
  INDEX `idx_tags` ((CAST(`tags` as CHAR(255) ARRAY))),
  FULLTEXT INDEX `idx_fulltext` (`name`, `description`, `subcategory`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS `orders_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buyerId` int(11) NOT NULL,
  `sellerId` int(11) NOT NULL,
  `orderNumber` varchar(50) UNIQUE NOT NULL,
  `status` enum('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
  `totalAmount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'THB',
  `shippingAddress` json NOT NULL,
  `billingAddress` json,
  `paymentMethod` enum('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOBILE_PAYMENT', 'OTHER') DEFAULT 'CASH',
  `paymentStatus` enum('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
  `shippingMethod` varchar(100),
  `shippingCost` decimal(10,2) DEFAULT 0,
  `estimatedDelivery` date,
  `actualDelivery` datetime,
  `notes` text,
  `trackingNumber` varchar(100),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`buyerId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sellerId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_buyer_id` (`buyerId`),
  INDEX `idx_seller_id` (`sellerId`),
  INDEX `idx_order_number` (`orderNumber`),
  INDEX `idx_status` (`status`),
  INDEX `idx_payment_status` (`paymentStatus`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `specifications` json,
  `notes` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`orderId`) REFERENCES `orders_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `marketplace_products_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_order_id` (`orderId`),
  INDEX `idx_product_id` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data (optional)
-- INSERT INTO `users_GrowthFarm` (`email`, `password`, `firstName`, `lastName`, `role`) VALUES
-- ('admin@growthfarm.com', '$2b$10$example', 'Admin', 'User', 'ADMIN'),
-- ('farmer@growthfarm.com', '$2b$10$example', 'John', 'Farmer', 'FARMER'),
-- ('buyer@growthfarm.com', '$2b$10$example', 'Jane', 'Buyer', 'BUYER');

-- Show created tables
SHOW TABLES LIKE '%_GrowthFarm';

-- 7. IOT Devices Table
CREATE TABLE IF NOT EXISTS `iot_devices_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmId` int(11) NOT NULL,
  `zoneId` int(11),
  `deviceName` varchar(255) NOT NULL,
  `deviceType` enum('SENSOR', 'ACTUATOR', 'CONTROLLER', 'CAMERA', 'WEATHER_STATION', 'IRRIGATION', 'OTHER') DEFAULT 'SENSOR',
  `model` varchar(100),
  `manufacturer` varchar(100),
  `serialNumber` varchar(100) UNIQUE,
  `macAddress` varchar(50),
  `ipAddress` varchar(50),
  `firmwareVersion` varchar(50),
  `status` enum('ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR') DEFAULT 'OFFLINE',
  `lastSeen` timestamp NULL,
  `location` varchar(500),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8),
  `specifications` json,
  `configuration` json,
  `isActive` boolean DEFAULT true,
  `installationDate` date,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`zoneId`) REFERENCES `farm_zones_GrowthFarm`(`id`) ON DELETE SET NULL,
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_zone_id` (`zoneId`),
  INDEX `idx_device_type` (`deviceType`),
  INDEX `idx_status` (`status`),
  INDEX `idx_serial_number` (`serialNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Sensor Data Table
CREATE TABLE IF NOT EXISTS `sensor_data_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deviceId` int(11) NOT NULL,
  `sensorType` enum('TEMPERATURE', 'HUMIDITY', 'SOIL_MOISTURE', 'PH', 'LIGHT', 'CO2', 'PRESSURE', 'WIND_SPEED', 'RAIN', 'OTHER') NOT NULL,
  `value` decimal(10,4) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `quality` enum('GOOD', 'FAIR', 'POOR', 'ERROR') DEFAULT 'GOOD',
  `metadata` json,
  `recordedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`deviceId`) REFERENCES `iot_devices_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_device_id` (`deviceId`),
  INDEX `idx_sensor_type` (`sensorType`),
  INDEX `idx_recorded_at` (`recordedAt`),
  INDEX `idx_device_sensor_time` (`deviceId`, `sensorType`, `recordedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Crop Management Table
CREATE TABLE IF NOT EXISTS `crops_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zoneId` int(11) NOT NULL,
  `cropName` varchar(255) NOT NULL,
  `variety` varchar(255),
  `category` enum('VEGETABLE', 'FRUIT', 'GRAIN', 'HERB', 'FLOWER', 'TREE', 'OTHER') DEFAULT 'VEGETABLE',
  `plantingDate` date NOT NULL,
  `expectedHarvestDate` date,
  `actualHarvestDate` date,
  `quantity` decimal(10,2),
  `unit` varchar(20) DEFAULT 'kg',
  `status` enum('PLANTED', 'GROWING', 'FLOWERING', 'FRUITING', 'READY_TO_HARVEST', 'HARVESTED', 'FAILED') DEFAULT 'PLANTED',
  `growthStage` varchar(100),
  `healthStatus` enum('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DISEASED') DEFAULT 'GOOD',
  `notes` text,
  `images` json,
  `careInstructions` json,
  `diseases` json,
  `treatments` json,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`zoneId`) REFERENCES `farm_zones_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_zone_id` (`zoneId`),
  INDEX `idx_crop_name` (`cropName`),
  INDEX `idx_status` (`status`),
  INDEX `idx_planting_date` (`plantingDate`),
  INDEX `idx_harvest_date` (`expectedHarvestDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Activities Log Table
CREATE TABLE IF NOT EXISTS `activities_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `farmId` int(11),
  `zoneId` int(11),
  `cropId` int(11),
  `activityType` enum('PLANTING', 'WATERING', 'FERTILIZING', 'PRUNING', 'HARVESTING', 'PEST_CONTROL', 'DISEASE_TREATMENT', 'SOIL_PREPARATION', 'MAINTENANCE', 'MONITORING', 'OTHER') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `startTime` datetime NOT NULL,
  `endTime` datetime,
  `duration` int(11),
  `materials` json,
  `cost` decimal(10,2),
  `result` enum('SUCCESS', 'PARTIAL', 'FAILED', 'PENDING') DEFAULT 'PENDING',
  `notes` text,
  `images` json,
  `weatherConditions` json,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`zoneId`) REFERENCES `farm_zones_GrowthFarm`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`cropId`) REFERENCES `crops_GrowthFarm`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_zone_id` (`zoneId`),
  INDEX `idx_crop_id` (`cropId`),
  INDEX `idx_activity_type` (`activityType`),
  INDEX `idx_start_time` (`startTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Weather Data Table
CREATE TABLE IF NOT EXISTS `weather_data_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmId` int(11),
  `location` varchar(500),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8),
  `temperature` decimal(5,2),
  `humidity` decimal(5,2),
  `pressure` decimal(7,2),
  `windSpeed` decimal(6,2),
  `windDirection` int(3),
  `rainfall` decimal(8,2),
  `visibility` decimal(6,2),
  `uvIndex` decimal(4,2),
  `cloudCover` int(3),
  `weatherCondition` enum('CLEAR', 'PARTLY_CLOUDY', 'CLOUDY', 'OVERCAST', 'RAIN', 'HEAVY_RAIN', 'STORM', 'FOG', 'SNOW'),
  `recordedAt` timestamp NOT NULL,
  `source` enum('API', 'WEATHER_STATION', 'SENSOR', 'MANUAL') DEFAULT 'API',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE SET NULL,
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_location` (`latitude`, `longitude`),
  INDEX `idx_recorded_at` (`recordedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. AI Conversations Table
CREATE TABLE IF NOT EXISTS `ai_conversations_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `sessionId` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `response` text NOT NULL,
  `messageType` enum('QUESTION', 'ADVICE', 'ANALYSIS', 'ALERT', 'GENERAL') DEFAULT 'QUESTION',
  `context` json,
  `confidence` decimal(4,3),
  `feedback` enum('HELPFUL', 'NEUTRAL', 'NOT_HELPFUL'),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_session_id` (`sessionId`),
  INDEX `idx_message_type` (`messageType`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS `notifications_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('INFO', 'WARNING', 'ALERT', 'SUCCESS', 'ERROR', 'REMINDER') DEFAULT 'INFO',
  `category` enum('SYSTEM', 'WEATHER', 'CROP', 'DEVICE', 'MARKETPLACE', 'ACTIVITY', 'AI') DEFAULT 'SYSTEM',
  `priority` enum('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
  `isRead` boolean DEFAULT false,
  `relatedEntityType` enum('FARM', 'ZONE', 'CROP', 'DEVICE', 'ORDER', 'ACTIVITY'),
  `relatedEntityId` int(11),
  `actionRequired` boolean DEFAULT false,
  `expiresAt` timestamp NULL,
  `metadata` json,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `readAt` timestamp NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_type` (`type`),
  INDEX `idx_category` (`category`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_is_read` (`isRead`),
  INDEX `idx_created_at` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Reports Table
CREATE TABLE IF NOT EXISTS `reports_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `farmId` int(11),
  `reportType` enum('DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL', 'ANNUAL', 'CUSTOM', 'CROP_SUMMARY', 'FINANCIAL', 'PRODUCTION') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `parameters` json,
  `data` json NOT NULL,
  `generatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `periodStart` date NOT NULL,
  `periodEnd` date NOT NULL,
  `format` enum('JSON', 'PDF', 'EXCEL', 'CSV') DEFAULT 'JSON',
  `status` enum('GENERATING', 'COMPLETED', 'FAILED') DEFAULT 'COMPLETED',
  `fileUrl` varchar(500),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE SET NULL,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_report_type` (`reportType`),
  INDEX `idx_period` (`periodStart`, `periodEnd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Team Members Table  
CREATE TABLE IF NOT EXISTS `team_members_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `role` enum('OWNER', 'MANAGER', 'WORKER', 'ADVISOR', 'VIEWER') DEFAULT 'WORKER',
  `permissions` json,
  `salary` decimal(10,2),
  `workSchedule` json,
  `joinedDate` date NOT NULL,
  `leftDate` date,
  `isActive` boolean DEFAULT true,
  `notes` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_farm_user` (`farmId`, `userId`),
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Financial Records Table
CREATE TABLE IF NOT EXISTS `financial_records_GrowthFarm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` enum('INCOME', 'EXPENSE', 'INVESTMENT', 'LOAN', 'GRANT', 'INSURANCE') NOT NULL,
  `category` enum('SEEDS', 'FERTILIZER', 'EQUIPMENT', 'LABOR', 'UTILITIES', 'MAINTENANCE', 'SALES', 'MARKETING', 'INSURANCE', 'TAX', 'OTHER') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'THB',
  `description` text NOT NULL,
  `date` date NOT NULL,
  `paymentMethod` enum('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'OTHER'),
  `receipt` varchar(500),
  `taxDeductible` boolean DEFAULT false,
  `relatedEntityType` enum('CROP', 'ZONE', 'DEVICE', 'ORDER', 'ACTIVITY'),
  `relatedEntityId` int(11),
  `status` enum('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'COMPLETED',
  `notes` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmId`) REFERENCES `farms_GrowthFarm`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users_GrowthFarm`(`id`) ON DELETE CASCADE,
  INDEX `idx_farm_id` (`farmId`),
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_type` (`type`),
  INDEX `idx_category` (`category`),
  INDEX `idx_date` (`date`),
  INDEX `idx_amount` (`amount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Show all created tables
SHOW TABLES LIKE '%_GrowthFarm';
