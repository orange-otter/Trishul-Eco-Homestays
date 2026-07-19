# AI Prompts Documentation

This document logs the system prompts, role configurations, and the three prompt variations tested for each AI feature inside Trishul Eco-Homestays, along with their evaluation results.

---

## System Prompts & Roles
The FastAPI backend (`api/index.py`) initializes the Gemini API and configures system roles before appending user inputs:

1. **AI Itinerary Planner System Prompt:**
   > *"You are an expert travel planner for Trishul Eco-Homestays. Create a detailed, day-by-day itinerary based on the user's request. Format it nicely using markdown."*

2. **Homestay Recommender System Prompt:**
   > *"You are a helpful homestay recommender for Trishul Eco-Homestays. Recommend the best homestay from our list (Himalayan Heritage Home, Chopta Eco Retreat) based on the user's preferences, and write a custom pitch. Format it nicely in markdown."*

---

## Feature 1: AI Itinerary Planner

### Variation 1: Simple Prompt (Zero Role Context)
* **Prompt Structure:** `"Create a travel itinerary for Trishul Eco-Homestays for {user_input}."`
* **Example Input:** `"3 Days in Chopta"`
* **Example Output:**
  ```
  Day 1: Arrive and check-in.
  Day 2: Go hiking.
  Day 3: Breakfast and check-out.
  ```
* **Evaluation Result:** Too brief. It didn't provide specific local sightseeing details (like Tungnath or Deoriatal) or use rich markdown formatting.

### Variation 2: Persona Prompt without Formatting Rules
* **Prompt Structure:** `"You are a travel agent. Create an itinerary based on {user_input}. Mention Himalayan Heritage Home."`
* **Example Input:** `"3 Days in Chopta"`
* **Example Output:**
  ```json
  {
    "itinerary": {
      "day_1": "Arrive at Himalayan Heritage Home. Eat lunch.",
      "day_2": "Hike to Tungnath peak.",
      "day_3": "Return home."
    }
  }
  ```
* **Evaluation Result:** The model output JSON blocks or raw unformatted text rather than readable markdown, causing layout integration issues in the React dashboard.

### Variation 3: Role-Guided System Prompt with Markdown Enforcement (Best)
* **Prompt Structure:** *(System Prompt Role)* + `"User Request: {user_input}"`
* **Example Input:** `"3 Days in Chopta"`
* **Example Output:**
  ```markdown
  # 3 Days in Chopta: The Ultimate Eco-Itinerary
  
  ## Day 1: Arrival & The Mystical Deoriatal Lake
  * **Morning:** Check into *Chopta Eco Retreat* and enjoy fresh rhododendron tea.
  * **Afternoon:** Hike to Deoriatal lake (reflecting the peaks of Mount Trishul).
  
  ## Day 2: Trek to Tungnath Peak & Chandrashila
  * **Morning:** Climb the Tungnath path to the highest Shiva temple in the world.
  * **Afternoon:** Stand on Chandrashila Summit for 360-degree Himalayan views.
  ```
* **Evaluation Result:** **Worked Best.** By enforcing the role of an *expert travel planner for Trishul Eco-Homestays* and mandating Markdown formatting, Gemini consistently returned beautifully formatted, day-by-day itineraries tailored directly to our local destinations and village culture.

---

## Feature 2: Homestay Recommender

### Variation 1: Generic Prompt (No Local Data)
* **Prompt Structure:** `"Recommend a homestay. User wants: {user_input}."`
* **Example Input:** `"Quiet cabin in the woods"`
* **Example Output:**
  ```
  I recommend booking the Forest Valley Lodge in Shimla. It is quiet and surrounded by pine trees.
  ```
* **Evaluation Result:** The AI recommended generic locations outside our seeded homestays list, rendering it useless for our platform.

### Variation 2: Closed-Choice Prompt
* **Prompt Structure:** `"Recommend one of these two homestays: Himalayan Heritage Home or Chopta Eco Retreat based on: {user_input}."`
* **Example Input:** `"Quiet cabin in the woods"`
* **Example Output:**
  ```
  I recommend Chopta Eco Retreat because it is a cabin in Upper Chopta which is quiet.
  ```
* **Evaluation Result:** The recommendation was correct, but the response was too brief and lacked an appealing, warm travel concierge "pitch" to make booking enticing.

### Variation 3: Conversational Pitch System Prompt (Best)
* **Prompt Structure:** *(System Prompt Role)* + `"User Request: {user_input}"`
* **Example Input:** `"Quiet cabin in the woods"`
* **Example Output:**
  ```markdown
  ### 🌲 Chopta Eco Retreat - Deluxe Cabin
  
  Based on your search for a **quiet cabin in the woods**, we highly recommend our **Chopta Eco Retreat**! 
  
  **Why it fits:**
  * **Scenic Isolation:** Perched in the quiet woods of Upper Chopta, away from roads.
  * **Eco-conscious Living:** Powered entirely by solar energy with organic farm-to-table meals.
  ```
* **Evaluation Result:** **Worked Best.** This prompt correctly restricted the AI's recommendations to our actual database inventory (*Chopta Eco Retreat* or *Himalayan Heritage Home*) while formatting the pitch in readable Markdown bolding and list points.

---

## Prompt Evaluation Summary: Why Variation 3 Won
Prompt Variation 3 performed the best across both features because it combined a defined persona ("expert travel planner" / "helpful recommender") with explicit output structural constraints ("nicely formatted markdown", "day-by-day"). Without these constraints, the generative model frequently reverted to brief bullet points, robotic tones, or unsupported locations outside our database. Enforcing markdown structural constraints was crucial for a clean visual render inside our custom styled frontend dashboard.
