# 🔍 LLM Whodunnit

_A playful interactive mystery game powered by a language model._

![screenshot](./screenshot.png)

---

## 🧠 What is this?

**LLM Whodunnit** is a murder mystery interrogation game where you, the investigator, must figure out which of three quirky suspects is guilty — by questioning them directly.

Each suspect is powered by a large language model and roleplays in character:
- One is guilty and will lie (badly)
- Two are innocent but odd

Ask them anything. Compare their stories. Then make your accusation.

---

## 💻 Built With

- [Next.js 14+ App Router](https://nextjs.org/)
- React + Tailwind CSS
- OpenAI GPT-3.5 API
- Optional: Ollama / Claude API support (coming soon)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/llm-whodunnit.git
cd llm-whodunnit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your OpenAI API key

Create a `.env.local` file:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

You’ll need an OpenAI account with billing enabled.

### 4. Start the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Play

1. A murder has taken place at the AI lab.
2. Question any of the 3 suspects — each has a distinct personality.
3. Listen carefully. One is lying.
4. When you're ready, accuse someone.
5. Win or lose, try again. The culprit is randomized each round.

---

## ✨ Features

- 🎭 Dynamic character personalities and guilt logic
- 💬 In-character LLM-generated responses
- 📜 Auto-scrolling chat log
- ✅ Win/loss logic and feedback
- 🔁 Instant replay with a new culprit

---

## 🧪 Future Ideas

- Red herrings and fake clues
- Case file panel or notebook
- Multi-round scoring
- More suspects + dialogue depth
- Mobile polish

---

## 📄 License

MIT — feel free to use or remix. Attribution appreciated!