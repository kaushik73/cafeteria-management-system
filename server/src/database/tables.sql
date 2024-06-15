use  testDB;
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'chef', 'employee') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    emp_id INT UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create Menu table
CREATE TABLE Menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    availability_status BOOLEAN NOT NULL,
    meal_type ENUM('lunch', 'dinner', 'breakfast') NOT NULL
);

-- Create Feedback table
CREATE TABLE Feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    comment TEXT,
    feedback_date DATETIME NOT NULL,
    user_id INT,
    menu_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- Create Notification table
CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type ENUM('recommendation', 'menuUpdate', 'availabilityChange') NOT NULL,
    message TEXT NOT NULL,
    notification_date DATETIME NOT NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- Create Recommendation table
CREATE TABLE Recommendation (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_type ENUM('lunch', 'dinner', 'breakfast') NOT NULL,
    recommendation_date DATETIME NOT NULL,
    average_rating INT NOT NULL,
    is_prepared BOOLEAN NOT NULL,
    menu_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id)
);

-- Create Report table
CREATE TABLE Report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('monthlyFeedback', 'sales', 'inventory') NOT NULL,
    generated_date DATETIME NOT NULL,
    menu_id INT,
    recommendation_id INT,
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
    FOREIGN KEY (recommendation_id) REFERENCES Recommendation(recommendation_id)
);
