# CodeMaster Project

## Overview
CodeMaster is a web application designed to help users learn programming through interactive courses, quizzes, and community engagement. The application allows users to sign up, log in, take quizzes, and track their performance.

### New Feature: Multi-Language Code Editor
The project now includes an advanced web-based code editor that supports multiple programming languages with real-time execution using the Piston API.

## Project Structure
The project is organized as follows:

```
project
├── src
│   ├── index.html          # Main entry point of the application
│   ├── login.html          # User login form
│   ├── signup.html         # User signup form
│   ├── quiz.html           # Quiz tasks for users
│   ├── users.html          # Table displaying users and their performance
│   ├── user-details.html    # Detailed performance information for individual users
│   ├── css
│   │   └── styles.css      # Styles for the application
│   ├── js
│   │   ├── main.js         # Main functionality and navigation
│   │   ├── auth.js         # User authentication management
│   │   ├── quiz.js         # Quiz functionality
│   │   ├── users.js        # Users table management
│   │   └── user-details.js  # User performance details retrieval
│   └── db
│       └── schema.sql      # SQL schema for the database
├── homehome
│   └── code-editor.html    # Multi-language code editor with Piston API
├── test-editor.html        # Test page for the code editor
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up the database**:
   - Use the `schema.sql` file located in the `src/db` directory to create the necessary tables in your database.

4. **Run the application**:
   - Open `src/index.html` in your web browser to access the application.

## Usage Guidelines
- **Sign Up**: New users can create an account using the signup form.
- **Login**: Existing users can log in to access their dashboard and quizzes.
- **Quizzes**: Users can take quizzes to test their programming knowledge.
- **User Performance**: Users can view their performance metrics in the users table and click on individual entries to see detailed performance information.
- **Code Editor**: Access the multi-language code editor at `homehome/code-editor.html` to write and execute code in 15+ programming languages.

## Code Editor Features
### Supported Languages
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Java, C++, C#, Go, Ruby, Swift, PHP, Kotlin, TypeScript, Perl, R

### Key Features
- Real-time syntax highlighting with Monaco Editor
- Code execution using Piston API
- Built-in code templates for each language
- Error handling and debugging support
- Input/output handling
- File saving with proper extensions
- Responsive design for mobile devices

### How to Use the Code Editor
1. Open `homehome/code-editor.html` in your browser
2. Select a programming language from the dropdown
3. Write your code in the editor (templates provided)
4. Add input if your program requires it
5. Click "Run" to execute the code
6. View output and any error messages
7. Save your code using the "Save" button

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.