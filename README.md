# Address Book Application

This is an Address Book application that allows users to manage their contacts and organize them into groups such as "Family" and "Work". The application supports tagging contacts under multiple groups and provides a user-friendly interface for managing contacts and groups.

## Features

- Add, edit, and delete contacts
- Create, update, and delete groups
- Assign contacts to multiple groups
- Filter and view contacts by group

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL

## Project Structure

```
address-book-app
├── src
│   ├── server.js
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   ├── contactController.js
│   │   └── groupController.js
│   ├── models
│   │   ├── Contact.js
│   │   ├── Group.js
│   │   └── ContactGroup.js
│   ├── routes
│   │   ├── contactRoutes.js
│   │   └── groupRoutes.js
│   └── middleware
│       └── errorHandler.js
├── public
│   ├── index.html
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── app.js
│       ├── contactManager.js
│       └── groupManager.js
├── database
│   └── schema.sql
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd address-book-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up the MySQL database:
   - Create a new database and run the SQL commands in `database/schema.sql` to set up the necessary tables.

5. Configure the database connection in `src/config/database.js` with your MySQL credentials.

6. Start the server:
   ```
   node src/server.js
   ```

7. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

- Use the interface to add new contacts and groups.
- Assign contacts to groups and filter contacts by group.
- Edit or delete contacts and groups as needed.

## License

This project is licensed under the MIT License.