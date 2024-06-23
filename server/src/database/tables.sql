drop database cafeteria;

CREATE database cafeteria;

use cafeteria;

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'chef', 'employee') NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_id INT UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status BOOLEAN NOT NULL,
    meal_type ENUM('lunch', 'dinner', 'breakfast') NOT NULL
);

CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    comment TEXT,
    feedback_date DATETIME NOT NULL,
    user_id INT,
    menu_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL
);

CREATE TABLE VotedItem (
    voteItem_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    is_voted BOOLEAN NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE
    SET
        NULL
);

CREATE TABLE Preference (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    dietary_preference ENUM('Vegetarian', 'Non Vegetarian', 'Eggetarian') NOT NULL,
    spice_level ENUM('high', 'medium', 'low') NOT NULL,
    cuisine_preference ENUM('north-indian', 'south-indian', 'other') NOT NULL,
    sweet_tooth BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE
    SET
        NULL
);

CREATE TABLE VotedItem (
    voteItem_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    is_voted BOOLEAN NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE
    SET
        NULL
);

- - data will be enterd automatically CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type ENUM(
        'recommendation',
        'menuUpdate',
        'availabilityChange'
    ) NOT NULL,
    message TEXT NOT NULL,
    notification_date DATETIME NOT NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL
);

CREATE TABLE Recommendation (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_type ENUM('lunch', 'dinner', 'breakfast') NOT NULL,
    recommendation_date DATETIME NOT NULL,
    average_rating INT NOT NULL,
    average_sentiment INT NOT NULL,
    rollout_to_employee BOOLEAN NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL
);

CREATE TABLE Report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('monthlyFeedback', 'sales') NOT NULL,
    generated_date DATETIME NOT NULL,
    menu_id INT,
    recommendation_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (recommendation_id) REFERENCES Recommendation(recommendation_id) ON DELETE
    SET
        NULL
);

-- change log to Log
CREATE TABLE log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE
    SET
        NULL
);

-- from '2024-01-01' ;
-- to '2024-07-01' ;
DELIMITER / / CREATE PROCEDURE FeedbackReport(IN startDate DATE, IN endDate DATE) BEGIN
SELECT
    m.item_name AS itemName,
    COALESCE(AVG(f.rating), 0) AS averageRating,
    COALESCE(COUNT(f.feedback_id), 0) AS totalFeedbacks,
    COALESCE(COUNT(r.recommendation_id), 0) AS timesRecommended,
    COALESCE(SUM(r.rollout_to_employee), 0) AS rolloutToEmployee
FROM
    Menu m
    LEFT JOIN Feedback f ON f.menu_id = m.menu_id
    AND f.feedback_date BETWEEN startDate
    AND endDate
    LEFT JOIN Recommendation r ON r.menu_id = m.menu_id
    AND r.recommendation_date BETWEEN startDate
    AND endDate
GROUP BY
    m.menu_id
ORDER BY
    averageRating DESC;

END;