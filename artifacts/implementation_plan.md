# Implement Hyper-Realistic J.A.R.V.I.S Voice & Auto-Scroll

Based on your feedback, we will ditch the boring, native browser text-to-speech. We need the agent to sound like a **real human**, taking its time to converse naturally, separating what is *spoken* from what is *displayed*.

## Proposed Architecture Changes

### 1. Separation of Spoken and Visual Logic
- Instead of just reading the screen text, I will modify the backend (`api/chat/route.ts`) so the LLM generates two distinct outputs:
  - **`spoken_text`**: A highly conversational, brief, and "human-like" engagement (e.g. "Here's what I can do for you...")
  - **`visual_text`**: The actual detailed text or UI components rendered in the chat window.

### 2. ElevenLabs Integration (Ultra-Realistic Voice)
- We will integrate **ElevenLabs API** (the industry standard for realistic, human-like AI voices).
- I will create a new Next.js API route (`/api/tts`) that securely calls ElevenLabs to generate an MP3 audio buffer from the `spoken_text`.
- The frontend will automatically play this audio while the visual response renders.

### 3. Smooth Auto-Scroll
- When the agent triggers `NAVIGATE`, it will audibly say something like *"Let me pull up my capabilities for you."*
- The screen will navigate to the new page.
- After a short (~800ms) delay to allow the page to mount, it will smoothly scroll down by 400-500 pixels to naturally focus the user's attention.

## User Action Required
> [!IMPORTANT]
> To achieve the "real human" voice, **ElevenLabs** is required. 
> 1. Do you already have an ElevenLabs API Key I can use, or would you prefer I use OpenAI's TTS API? 
> 2. Please let me know which service you prefer and ensure the key is placed in your `.env.local` file (e.g., `ELEVENLABS_API_KEY=your_key_here`).

*Let me know your preferred voice provider, and I will begin the execution.*
