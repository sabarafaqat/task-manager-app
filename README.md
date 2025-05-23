# Task Manager Project

## Setup Instructions

### Frontend (Client)
1. Navigate to the client directory:
   
   cd client
   
2. Install dependencies:
   
   npm install
   
3. Run the development server:
   
   npm run dev
   
4. Open your browser and go to http://localhost:3000 to view the app.

### Backend (Server)
1. Navigate to the server directory:
   
   cd server
   
2. Install dependencies:
   
   npm install
   
3. Run the backend server:
   
   npm start
   
4. The backend API will be available at http://localhost:5000 (or the configured port).

## Project Structure and Logic

- client/: Contains the frontend Next.js React application.
  - components/: React components including Kanban board, columns, task modal, etc.
  - features/: Redux slices and state management.
  - hooks/: Custom React hooks.
  - lib/: Utility functions.
- server/: Contains the backend API server code.
- The frontend communicates with the backend API for task management.
- State management is handled using Redux Toolkit.
- Drag and drop functionality is implemented using @hello-pangea/dnd.
- Task creation, editing, deleting, filtering, and overdue badge features are implemented.

## Bonus Features
- Responsive design for mobile and desktop.
- User authentication and profile management.
- Task assignment to multiple users.
- Overdue task badge with visual indicator.
- Theme toggle (light/dark mode).

## Loom Video
https://www.loom.com/share/ec38779c1c5e479198d5241579d70399


---

