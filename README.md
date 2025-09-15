# Frontend README (React + Vite)

# Resume Builder Frontend

## Overview  
This is the frontend React application for the multi-tenant Resume Builder platform. It is built with Vite, React Context API for state management, and integrates with the backend API for authentication, notes, subscription upgrades, and user invitations.

---

## Features

- User authentication & role-based UI  
- Multi-tenant aware components  
- Resume templates and live preview  
- Notes management (create, list)  
- Subscription upgrade UI for admins  
- User invitation form for admins  

---

## Tech Stack

- React 18+  
- Vite (for fast dev + build)  
- React Context API for auth and global state  
- Tailwind CSS or custom CSS for styling  
- Fetch API to communicate with backend

---

## Setup

### Prerequisites

- Node.js 16+  
- npm or yarn  

### Installation

git clone <repo-url>
cd <frontend-folder>
npm install


### Development Server

Run locally with hot reload:

npm run dev

Open http://localhost:5173 in your browser.

### Build for Production

npm run build

The build output is in the `dist/` folder.

---

## Environment Variables

Configure API base URL via environment variables if needed.

---

## API Integration

- All API calls target `/api/*` routes, proxied or relative.
- Authenticated requests send JWT token in `Authorization` header.

---

## Scripts

- `dev` - Runs the development server  
- `build` - Builds for production  
- `preview` - Serves production build locally

---

## Contributing

Bug reports and pull requests welcome.

---

## License

MIT License  