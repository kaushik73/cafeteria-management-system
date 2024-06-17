USE testDB;

-- Insert 10 rows into Users
INSERT INTO
    Users (role, name, email, emp_id, password)
VALUES
    (
        'admin',
        'Alice Johnson',
        'alice.johnson@example.com',
        101,
        'password123'
    ),
    (
        'chef',
        'Bob Smith',
        'bob.smith@example.com',
        102,
        'password123'
    ),
    (
        'employee',
        'Charlie Brown',
        'charlie.brown@example.com',
        103,
        'password123'
    ),
    (
        'employee',
        'David Wilson',
        'david.wilson@example.com',
        104,
        'password123'
    ),
    (
        'employee',
        'Eve Davis',
        'eve.davis@example.com',
        105,
        'password123'
    ),
    (
        'employee',
        'Frank Harris',
        'frank.harris@example.com',
        106,
        'password123'
    ),
    (
        'employee',
        'Grace Lee',
        'grace.lee@example.com',
        107,
        'password123'
    ),
    (
        'employee',
        'Hank Martin',
        'hank.martin@example.com',
        108,
        'password123'
    ),
    (
        'employee',
        'Ivy Clark',
        'ivy.clark@example.com',
        109,
        'password123'
    ),
    (
        'employee',
        'Jack Lewis',
        'jack.lewis@example.com',
        110,
        'password123'
    );

-- Insert 10 rows into Menu
INSERT INTO
    Menu (item_name, price, availability_status, meal_type)
VALUES
    ('Pasta', 9.99, TRUE, 'lunch'),
    ('Pizza', 12.99, TRUE, 'dinner'),
    ('Burger', 8.99, TRUE, 'lunch'),
    ('Salad', 7.99, TRUE, 'lunch'),
    ('Soup', 5.99, TRUE, 'dinner'),
    ('Sandwich', 6.99, TRUE, 'breakfast'),
    ('Omelette', 4.99, TRUE, 'breakfast'),
    ('Steak', 15.99, TRUE, 'dinner'),
    ('Tacos', 10.99, TRUE, 'lunch'),
    ('Pancakes', 5.99, TRUE, 'breakfast');

-- Insert 10 rows into Feedback
INSERT INTO
    Feedback (rating, comment, feedback_date, user_id, menu_id)
VALUES
    (5, 'Excellent!', '2024-06-01 08:00:00', 3, 1),
    (4, 'Very good', '2024-06-01 09:00:00', 4, 2),
    (3, 'It was okay', '2024-06-02 10:00:00', 5, 3),
    (5, 'Loved it!', '2024-06-03 11:00:00', 6, 4),
    (2, 'Not great', '2024-06-04 12:00:00', 7, 5),
    (4, 'Pretty good', '2024-06-05 13:00:00', 8, 6),
    (5, 'Fantastic', '2024-06-06 14:00:00', 9, 7),
    (3, 'It was decent', '2024-06-07 15:00:00', 10, 8),
    (4, 'Liked it', '2024-06-08 16:00:00', 3, 9),
    (5, 'Amazing!', '2024-06-09 17:00:00', 4, 10);

-- Insert 10 rows into Notification
INSERT INTO
    Notification (
        notification_type,
        message,
        notification_date,
        menu_id
    )
VALUES
    (
        'menuUpdate',
        'Menu item updated: Pasta',
        '2024-06-01 08:00:00',
        1
    ),
    (
        'availabilityChange',
        'Menu item now available: Pizza',
        '2024-06-02 09:00:00',
        2
    ),
    (
        'recommendation',
        'Recommended new item: Burger',
        '2024-06-03 10:00:00',
        3
    ),
    (
        'menuUpdate',
        'Menu item updated: Salad',
        '2024-06-04 11:00:00',
        4
    ),
    (
        'availabilityChange',
        'Menu item now available: Soup',
        '2024-06-05 12:00:00',
        5
    ),
    (
        'recommendation',
        'Recommended new item: Sandwich',
        '2024-06-06 13:00:00',
        6
    ),
    (
        'menuUpdate',
        'Menu item updated: Omelette',
        '2024-06-07 14:00:00',
        7
    ),
    (
        'availabilityChange',
        'Menu item now available: Steak',
        '2024-06-08 15:00:00',
        8
    ),
    (
        'recommendation',
        'Recommended new item: Tacos',
        '2024-06-09 16:00:00',
        9
    ),
    (
        'menuUpdate',
        'Menu item updated: Pancakes',
        '2024-06-10 17:00:00',
        10
    );

-- Insert 30 rows into Recommendation
INSERT INTO
    Recommendation (
        meal_type,
        recommendation_date,
        average_rating,
        is_prepared,
        menu_id
    )
VALUES
    ('lunch', '2024-06-01 12:00:00', 5, 1, 1),
    ('dinner', '2024-06-01 18:00:00', 4, 0, 2),
    ('breakfast', '2024-06-02 08:00:00', 3, 1, 3),
    ('lunch', '2024-06-02 12:00:00', 5, 1, 1),
    ('dinner', '2024-06-02 18:00:00', 4, 1, 2),
    ('breakfast', '2024-06-03 08:00:00', 2, 0, 3),
    ('lunch', '2024-06-03 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-03 18:00:00', 3, 1, 2),
    ('breakfast', '2024-06-04 08:00:00', 4, 1, 3),
    ('lunch', '2024-06-04 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-04 18:00:00', 4, 0, 2),
    ('breakfast', '2024-06-05 08:00:00', 3, 1, 3),
    ('lunch', '2024-06-05 12:00:00', 5, 1, 1),
    ('dinner', '2024-06-05 18:00:00', 4, 1, 2),
    ('breakfast', '2024-06-06 08:00:00', 2, 0, 3),
    ('lunch', '2024-06-06 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-06 18:00:00', 3, 1, 2),
    ('breakfast', '2024-06-07 08:00:00', 4, 1, 3),
    ('lunch', '2024-06-07 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-07 18:00:00', 4, 0, 2),
    ('breakfast', '2024-06-08 08:00:00', 3, 1, 3),
    ('lunch', '2024-06-08 12:00:00', 5, 1, 1),
    ('dinner', '2024-06-08 18:00:00', 4, 1, 2),
    ('breakfast', '2024-06-09 08:00:00', 2, 0, 3),
    ('lunch', '2024-06-09 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-09 18:00:00', 3, 1, 2),
    ('breakfast', '2024-06-10 08:00:00', 4, 1, 3),
    ('lunch', '2024-06-10 12:00:00', 5, 0, 1),
    ('dinner', '2024-06-10 18:00:00', 4, 0, 2),
    ('breakfast', '2024-06-11 08:00:00', 3, 1, 3);