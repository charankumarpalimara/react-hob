# Alentur Admin

## Project Overview
Alentur Admin is a web application designed for managing organizations and their branches. It provides a user-friendly interface for creating and managing organization details, including branch information, contact details, and location data.

## Project Structure
The project is organized as follows:

```
alentur-admin
├── public
│   └── index.html          # Main HTML file for the application
├── src
│   ├── App.js              # Main component setting up routing and layout
│   ├── index.js            # Entry point for the React application
│   ├── scenes
│   │   └── organizationform
│   │       └── index.jsx   # Component for managing organization forms
│   ├── components           # Directory for reusable components
│   ├── assets               # Directory for static assets (images, fonts, etc.)
│   └── styles               # Directory for stylesheets
├── package.json             # Configuration file for npm
└── README.md                # Documentation for the project
```

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/harshgaya/alentur-admin.git
   ```

2. Navigate to the project directory:
   ```
   cd alentur-admin
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm start
```
This will launch the application in your default web browser at `http://localhost:3000`.

## Features
- Create and manage organizations and their branches.
- Form validation to ensure required fields are filled.
- Dynamic addition and removal of branch instances in the form.
- Integration with an API for fetching and submitting organization data.

## Contribution
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request detailing your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.