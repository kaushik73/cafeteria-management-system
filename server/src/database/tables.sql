CREATE database testDB;

use testDB;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'chef', 'employee') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    emp_id INT UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status BOOLEAN NOT NULL,
    meal_type ENUM('lunch', 'dinner', 'breakfast') NOT NULL,
    dietary_type ENUM('vegetarian', 'non-vegetarian', 'eggetarian') NOT NULL,
    spice_type ENUM('high', 'medium', 'low') NOT NULL,
    cuisine_type ENUM('north-indian', 'south-indian', 'other') NOT NULL,
    sweet_tooth_type BOOLEAN NOT NULL,
    is_discard BOOLEAN NULL
);

CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    comment TEXT,
    feedback_date DATETIME NOT NULL,
    user_id INT,
    menu_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE
    SET
        NULL,
        FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL
);

CREATE TABLE Preference (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    dietary_preference ENUM('vegetarian', 'non-vegetarian', 'eggetarian') NOT NULL,
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

CREATE TABLE Notification (
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
    FOREIGN KEY (user_id) REFERENCES Users(emp_id) ON DELETE
    SET
        NULL
);

CREATE TABLE DiscardMenuFeedback(
    discard_menu_id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NULL,
    menu_id INT NULL,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE
    SET
        NULL
);

CREATE TABLE votedItem (
    voted_item_id INT PRIMARY KEY,
    menu_id INT NOT NULL,
    vote_count INT NOT NULL,
    voted_item_date DATETIME NOT NULL,
    is_prepared BOOLEAN NOT NULL
);

-- TRIGGERS & STORED PROCEDURE
--from '2024-01-01'  to '2024-07-01';
DELIMITER / / -- 
CREATE PROCEDURE FeedbackReport(IN startDate DATE, IN endDate DATE) BEGIN
SELECT
    m.item_name AS itemName,
    m.meal_type as mealType,
    COALESCE(FLOOR(AVG(f.rating)), 0) AS averageRating,
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
    m.menu_id,
    f.rating
ORDER BY
    FIELD(m.meal_type, 'breakfast', 'lunch', 'dinner'),
    f.rating desc;

END;

CREATE TRIGGER after_menu_insert
AFTER
INSERT
    ON Menu FOR EACH ROW BEGIN
INSERT INTO
    Feedback (rating, comment, feedback_date, user_id, menu_id)
VALUES
    (3, 'normal taste', NOW(), NULL, NEW.menu_id);

END -- 
/ / DELIMITER;