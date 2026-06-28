# Trishul Eco-Homestays

Trishul Eco-Homestays is a sustainable village tourism platform designed for travelers seeking authentic cultural immersion and eco-friendly stays in Chopta, Uttarakhand.

## Overview

The platform connects conscious travelers with local village communities, offering:
- Authentic local homestay experiences.
- A sustainable livelihood stream for remote villagers.
- Preservation of the pristine Himalayan environment through eco-tourism practices.

## Technologies Used
- React + Vite
- TypeScript
- Custom Vanilla CSS (Design System)
- React Router DOM
- Lucide React (Icons)

## Getting Started

### Frontend Setup

To run the frontend project locally:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the local development server at `http://localhost:8000`

### Backend Setup

To run the Python/FastAPI backend locally:

1. Navigate to the `backend` folder: `cd backend`
2. Create and activate a virtual environment (`python -m venv venv`, then `venv\Scripts\activate` on Windows or `source venv/bin/activate` on Mac/Linux)
3. Install dependencies: `pip install fastapi uvicorn python-dotenv`
4. Copy `.env.example` to `.env` and configure variables.
5. Start the development server: `uvicorn main:app --reload`
   (The backend typically runs on `http://localhost:8000`)
