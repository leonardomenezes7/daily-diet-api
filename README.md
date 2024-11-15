# 🍴 Daily Diet API 
I developed an API project for meal management as part of Rocketseat’s Node.js course, focusing on technical implementation with TypeScript, Fastify, Knex, and SQLite. The API provides routes for user account creation, meal logging, and retrieval of detailed dietary metrics. Each route is designed to ensure that users can register meals with attributes like name, description, date, time, and dietary compliance. Additionally, it includes routes for editing, deleting, and viewing individual meals, as well as a metrics route to provide insights such as total meals, meals within or outside the diet, and the longest sequence of on-diet meals.

## 📂 Project
<img width="100%" alt="Captura de Tela 2024-11-14 às 22 19 33" src="https://github.com/user-attachments/assets/7c825d7b-356b-48f0-b6bf-b6e10b5f9f06">

### 🟢 Status: Development completed

## ⚙️ Features
- User Creation: Allows users to create an account to manage their meals.
-	User Identification Between Requests: Implements a way to identify the user across requests, maintaining an active session.
-	Meal Logging: Enables users to log a meal with the following details: name, description, date and time, indicator of whether the meal is within or outside the diet.
- Associating Meals with Users: All logged meals are linked to the user who created them.
- Meal Editing: Allows users to edit all information of an existing meal (name, description, date and time, and diet indicator).
- Meal Deletion: Enables users to delete a specific meal.
- List All User Meals: Allows users to view a list of all meals they have logged.
- View a Single Meal: Provides access to the details of a specific meal.
- User Metrics Retrieval: Allows users to access metrics on their dietary habits, including: Total number of meals logged, total number of meals within the diet, total number of meals outside the diet, longest sequence of consecutive meals within the diet.
- Access Restriction: Users can only view, edit, and delete meals that they have logged themselves, ensuring data privacy and security.

## 🛠️ Technologies Used
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-316192?style=for-the-badge&logo=sqlite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-202020?style=for-the-badge&logo=vitest&logoColor=white)

## 💾 Database Structure
<img width="100%" alt="Captura de Tela 2024-11-14 às 22 41 24" src="https://github.com/user-attachments/assets/59387a2f-0c1c-4dcf-abc8-741308f6ae61">

## 🎛️ Bussiness Rules

users:
- `id` Unique identifier for each user
- `session_id` Cookie identifier of each user between requests
- `name` User name
- `email` User email
- `created_at` Timestamp when user was created
- `updated_at` Timestamp when user was updated

meals:

- `id` Unique identifier for each meal
- `user_id` Foreign key that links the corresponding user to the meal
- `name` Meal name
- `description` Short description of the meal
- `date` Meal date
- `is_on_diet` Boolean that checks whether the meal is in the diet or not
- `created_at` Timestamp when meal was created
- `updated_at` Timestamp when meal was updated

## ↔️ Routes
- `POST /users` Creates a user in the database by sending the `name` and `email` fields in the request body and creates a `session_id` cookie in the application headers, the `created_at`, `session_id` and `updated_at` fields are filled automatically.
- `POST /meals` Creates a meal in the database by checking if there is a `session_id` cookie in the request headers and sending the `name`, `description`, `date`, `is_on_diet` fields through the request body, the `user_id`, `created_at` and `updated_at` fields are automatically filled in.
- `GET /meals`  Lists all meals by the user’s `session_id as request cookies.
- `GET /meals/:mealId` Lists a specific meal by the user’s `session_id` from request cookies and the meal id from request params.
- `PUT /meals/:mealId` Updates a user's meal searched for by the `session_id` cookie and changes the desired data by sending `name`, `description`, `date` and `is_on_diet` via the request body, the `updated_at` field is automatically filled in.
- `DELETE /meals/:mealId` Deletes a meal from the database by sending the `id` via request params.
- `GET /meals/metrics` List of user metrics using the `session_id` cookie, informing the total number of meals, number of meals inside and outside the diet and the longest sequence of meals within the diet.
