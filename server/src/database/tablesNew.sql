CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `role` enum('admin', 'chef', 'employee') NOT NULL,
    `name` varchar(255) NOT NULL,
    `user_id` int DEFAULT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `user_id` (`user_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci