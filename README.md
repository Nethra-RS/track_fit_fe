# TrackFit

## Overview
TrackFit is a web-based fitness tracking platform that allows users to set goals, plan workouts, and monitor their progress. The application features a user-friendly interface with various functionalities to enhance the fitness journey.

## Hosting & Access
- **URL**: [https://rxm3891.uta.cloud/](https://rxm3891.uta.cloud/)
- **Demo Login Credentials**:
  - **Email**: test@example.com
  - **Password**: password123

## Features
- **User Authentication**: Sign up, log in, and password reset functionality.
- **Dashboard**: Overview of user fitness activities and progress.
- **Goal Management**: Set and track fitness goals.
- **Workout Planner**: Create and manage workout routines.
- **Profile Settings**: Update user information and preferences.
- **Support & Feedback**: Contact support, report bugs, and view FAQs.

## Installation & Setup
To run the project locally, follow these steps:

### Prerequisites
Ensure you have the following installed:
- Node.js (Latest version)
- npm (Node Package Manager)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd trackfit_frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. Open the browser and navigate to `http://localhost:3000/`

## File Structure
```
trackfit_frontend/
│── src/                    # Main source files
│   ├── components/         # Reusable components
│   ├── pages/              # Page-level components
│   ├── styles/             # CSS & theme files
│   ├── App.js              # Main application file
│   ├── index.js            # Entry point
│── public/                 # Static assets
│── package.json            # Project dependencies and scripts
│── README.md               # Project documentation
```

## Technologies Used
- **Frontend**: React.js, React Router, Bootstrap, Tailwind CSS
- **State Management**: React Context API
- **Backend (if applicable)**: Node.js, Express.js

## License
This project is licensed under the MIT License.
