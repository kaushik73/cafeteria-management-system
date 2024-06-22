-- Insert data into User table
INSERT INTO
    User (role, name, user_id, email, password)
VALUES
    (
        'admin',
        'John Doe',
        101,
        'john.doe@example.com',
        'password123'
    ),
    (
        'chef',
        'Jane Smith',
        102,
        'jane.smith@example.com',
        'password123'
    ),
    (
        'employee',
        'Alice Johnson',
        103,
        'alice.johnson@example.com',
        'password123'
    ),
    (
        'employee',
        'Bob Brown',
        104,
        'bob.brown@example.com',
        'password123'
    ),
    (
        'employee',
        'Charlie Davis',
        105,
        'charlie.davis@example.com',
        'password123'
    );

-- Insert data into Menu table
INSERT INTO
    Menu (
        item_name,
        price,
        availability_status,
        meal_type,
        dietary_type,
        spice_type,
        cuisine_type,
        sweet_tooth_type,
        is_discard
    )
VALUES
    (
        'Paneer Butter Masala',
        12.99,
        TRUE,
        'lunch',
        'Vegetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Chicken Biryani',
        15.99,
        TRUE,
        'lunch',
        'Non Vegetarian',
        'high',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Egg Curry',
        10.99,
        TRUE,
        'dinner',
        'Eggetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Masala Dosa',
        8.99,
        TRUE,
        'breakfast',
        'Vegetarian',
        'low',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Gulab Jamun',
        5.99,
        TRUE,
        'dinner',
        'Vegetarian',
        'low',
        'other',
        TRUE,
        FALSE
    ),
    (
        'Fish Curry',
        14.99,
        TRUE,
        'lunch',
        'Non Vegetarian',
        'high',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Chole Bhature',
        9.99,
        TRUE,
        'lunch',
        'Vegetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Mutton Rogan Josh',
        18.99,
        TRUE,
        'dinner',
        'Non Vegetarian',
        'high',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Vegetable Pulao',
        7.99,
        TRUE,
        'dinner',
        'Vegetarian',
        'low',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Butter Chicken',
        16.99,
        TRUE,
        'dinner',
        'Non Vegetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Egg Fried Rice',
        9.99,
        TRUE,
        'lunch',
        'Eggetarian',
        'medium',
        'other',
        FALSE,
        FALSE
    ),
    (
        'Palak Paneer',
        11.99,
        TRUE,
        'dinner',
        'Vegetarian',
        'low',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Idli Sambar',
        6.99,
        TRUE,
        'breakfast',
        'Vegetarian',
        'low',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Chicken Kebab',
        13.99,
        TRUE,
        'lunch',
        'Non Vegetarian',
        'high',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Veg Biryani',
        10.99,
        TRUE,
        'lunch',
        'Vegetarian',
        'medium',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Prawn Curry',
        17.99,
        TRUE,
        'dinner',
        'Non Vegetarian',
        'high',
        'south-indian',
        FALSE,
        FALSE
    ),
    (
        'Paneer Tikka',
        12.99,
        TRUE,
        'dinner',
        'Vegetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Sheer Khurma',
        6.99,
        TRUE,
        'dinner',
        'Vegetarian',
        'low',
        'other',
        TRUE,
        FALSE
    ),
    (
        'Chicken Tikka Masala',
        16.99,
        TRUE,
        'dinner',
        'Non Vegetarian',
        'medium',
        'north-indian',
        FALSE,
        FALSE
    ),
    (
        'Dhokla',
        5.99,
        TRUE,
        'breakfast',
        'Vegetarian',
        'low',
        'other',
        FALSE,
        FALSE
    );

-- Insert data into Feedback table
INSERT INTO
    Feedback (rating, comment, feedback_date, user_id, menu_id)
VALUES
    (
        5,
        'Excellent food!',
        '2024-06-01 12:30:00',
        101,
        1
    ),
    (4, 'Very tasty!', '2024-06-02 13:00:00', 102, 2),
    (
        3,
        'Average taste.',
        '2024-06-03 14:00:00',
        103,
        3
    ),
    (5, 'Loved it!', '2024-06-04 15:00:00', 104, 4),
    (
        4,
        'Good dessert.',
        '2024-06-05 16:00:00',
        105,
        5
    ),
    (
        3,
        'Too spicy for me.',
        '2024-06-06 12:30:00',
        101,
        6
    ),
    (5, 'Perfect!', '2024-06-07 13:00:00', 102, 7),
    (4, 'Delicious!', '2024-06-08 14:00:00', 103, 8),
    (3, 'Okayish.', '2024-06-09 15:00:00', 104, 9),
    (
        5,
        'Really good!',
        '2024-06-10 16:00:00',
        105,
        10
    ),
    (4, 'Nice!', '2024-06-11 12:30:00', 101, 11),
    (
        5,
        'Amazing taste!',
        '2024-06-12 13:00:00',
        102,
        12
    ),
    (
        3,
        'Could be better.',
        '2024-06-13 14:00:00',
        103,
        13
    ),
    (4, 'Yummy!', '2024-06-14 15:00:00', 104, 14),
    (5, 'Fantastic!', '2024-06-15 16:00:00', 105, 15),
    (3, 'Not bad.', '2024-06-16 12:30:00', 101, 16),
    (4, 'Good one.', '2024-06-17 13:00:00', 102, 17),
    (
        5,
        'Highly recommend!',
        '2024-06-18 14:00:00',
        103,
        18
    ),
    (3, 'Okay.', '2024-06-19 15:00:00', 104, 19),
    (
        4,
        'Pretty good!',
        '2024-06-20 16:00:00',
        105,
        20
    );

-- Insert data into Preference table
INSERT INTO
    Preference (
        user_id,
        dietary_preference,
        spice_level,
        cuisine_preference,
        sweet_tooth
    )
VALUES
    (
        101,
        'Vegetarian',
        'medium',
        'north-indian',
        TRUE
    ),
    (
        102,
        'Non Vegetarian',
        'high',
        'south-indian',
        FALSE
    ),
    (103, 'Eggetarian', 'low', 'other', TRUE),
    (
        104,
        'Vegetarian',
        'medium',
        'north-indian',
        FALSE
    ),
    (
        105,
        'Non Vegetarian',
        'high',
        'south-indian',
        TRUE
    );

-- Insert data into VotedItem table
INSERT INTO
    VotedItem (user_id, is_voted, menu_id)
VALUES
    (101, TRUE, 1),
    (102, TRUE, 2),
    (103, TRUE, 3),
    (104, TRUE, 4),
    (105, TRUE, 5),
    (101, FALSE, 6),
    (102, FALSE, 7),
    (103, FALSE, 8),
    (104, FALSE, 9),
    (105, FALSE, 10),
    (101, TRUE, 11),
    (102, TRUE, 12),
    (103, TRUE, 13),
    (104, TRUE, 14),
    (105, TRUE, 15),
    (101, FALSE, 16),
    (102, FALSE, 17),
    (103, FALSE, 18),
    (104, FALSE, 19),
    (105, FALSE, 20);