# AI Prompts Documentation

This document logs the variations of prompts we tested for our AI Features, and notes which one performed best.

## Feature 1: AI Itinerary Planner

### Attempt 1
**Prompt:** "Create a travel itinerary for Trishul Eco-Homestays for {user_input}."
* **Result:** Too brief, didn't format nicely or include details about our specific homestays.

### Attempt 2
**Prompt:** "You are a travel agent. Create an itinerary based on {user_input}. Mention Himalayan Heritage Home."
* **Result:** Better, but it included JSON blocks sometimes and ignored Markdown formatting.

### Attempt 3 (Final & Best)
**Prompt:** "You are an expert travel planner for Trishul Eco-Homestays. Create a detailed, day-by-day itinerary based on the user's request. Format it nicely using markdown."
* **Result:** Excellent. Gemini provided a structured, day-by-day breakdown with Markdown, perfectly matching the UI design and keeping a helpful, enthusiastic tone.

---

## Feature 2: Homestay Recommender

### Attempt 1
**Prompt:** "Recommend a homestay. User wants: {user_input}."
* **Result:** Recommended generic places not in our database.

### Attempt 2
**Prompt:** "Recommend one of these two homestays: Himalayan Heritage Home or Chopta Eco Retreat based on: {user_input}."
* **Result:** Good, but the description was a bit robotic and lacked a persuasive "pitch".

### Attempt 3 (Final & Best)
**Prompt:** "You are a helpful homestay recommender for Trishul Eco-Homestays. Recommend the best homestay from our list (Himalayan Heritage Home, Chopta Eco Retreat) based on the user's preferences, and write a custom pitch. Format it nicely in markdown."
* **Result:** Perfect. It accurately matched the vibe to the homestay and provided a compelling paragraph explaining *why* it was chosen, using Markdown bolding for emphasis.
