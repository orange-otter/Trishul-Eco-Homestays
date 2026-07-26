# Peer Review of Classmates' Repositories

For the following task, I selected two random repos and projects from the ones sent in the group.

---

## Review 1: NupurDimri / trishul-homestay-booking-ai
- **Repository URL:** https://github.com/NupurDimri/trishul-homestay-booking-ai
- **Deployed Site:** https://trishul-homestay-booking-ai.vercel.app/rooms

### Review Comment
**Architectural Observation:** 
The project uses a clean directory structure that separates the frontend and backend folders. In the FastAPI backend, however, the routes, database configurations, and Pydantic schemas are all consolidated within a single `main.py` file. While this works well for a smaller app, it can become difficult to maintain as you add more features. Dividing these routes into modular files using FastAPI's `APIRouter` (such as separating users, rooms, and bookings) would make the codebase easier to test and scale.

**Specific Code Suggestion:** 
In `backend/main.py` (specifically lines 87 and 115), the database sessions are manually initialized and closed using `db: Session = SessionLocal()` with a `finally` block in each endpoint handler. It would be cleaner to utilize FastAPI's dependency injection system. Setting up a standard `get_db` generator and injecting it via `Depends(get_db)` lets FastAPI manage the session lifecycle automatically, reducing duplicate code and making testing easier.

**Question:** 
How do you plan to manage authentication state as the application grows? Do you intend to use JWT-based tokens or another session management approach?

---

## Review 2: Dhruvverma09 / product-desc-generator
- **Repository URL:** https://github.com/Dhruvverma09/product-desc-generator
- **Deployed Site:** https://product-desc-generator-z98a.vercel.app/

### Review Comment
**Architectural Observation:** 
The backend code follows a structured Express.js layout with routes and controllers divided into modular files, which keeps `server.js` clean and readable. Since the database interactions use Mongoose, you could consider separating the database queries from the route controllers into separate service or query modules. This database abstraction layer helps keep the business logic clean and isolated from query definitions.

**Specific Code Suggestion:** 
In `backend/routes/generate.js` (lines 39-40), the API description request is handled by making a direct `fetch()` request to the model endpoint within the controller. Moving this integration code to a dedicated service module (such as `backend/services/aiService.js`) would help isolate external HTTP calls, making the route logic cleaner and easier to mock during tests.

**Question:** 
The README mentions LLaMA 3.1 via Groq, but the endpoint in your routes calls Google's Gemini API. Did you switch models during development, and what led to that decision?
