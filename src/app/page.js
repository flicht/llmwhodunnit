'use client'

import { useState, useEffect, useRef } from 'react'

const suspects = [
  {
    name: "Greta",
    prompt: "You are Greta, the nervous assistant. You are innocent but secretive. Answer questions in a shy and vague way, but do not lie.",
    emoji: "👀"
  },
  {
    name: "Colin",
    prompt: "You are Colin, the lead engineer. You are the guilty party. Try to deflect questions and avoid direct answers without revealing the truth. You might slip up with overconfidence.",
    emoji: "🧪"
  },
  {
    name: "Darla",
    prompt: "You are Darla, the head of security. You are innocent and stern. Respond confidently and concisely, but reveal only what you must.",
    emoji: "🔐"
  }
]

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [selected, setSelected] = useState(suspects[0])
  const [loading, setLoading] = useState(false)
  const [guilty, setGuilty] = useState(() => {
    const random = Math.floor(Math.random() * suspects.length)
    return suspects[random].name
  })
  const [hasAccused, setHasAccused] = useState(false)

  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const startGame = () => {
    const random = Math.floor(Math.random() * suspects.length)
    setGuilty(suspects[random].name)
    setHasAccused(false)
    setMessages([
      {
        role: 'system',
        content: "🧠 Welcome to LLM Whodunnit: A Mystery in the Machine. A brilliant AI researcher has been found dead in their lab. The investigation has narrowed to three suspects. Only one is guilty. Interrogate them carefully, and when you're ready, accuse the culprit."
      }
    ])
  }

  useState(startGame)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || hasAccused) return

    const userMessage = { role: "user", content: input, target: selected.name }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: selected.prompt
        })
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, target: selected.name }])
    } catch (err) {
      console.error("API error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccuse = (suspect) => {
    if (hasAccused) return
    const result = suspect.name === guilty
      ? `✅ You got it! ${suspect.name} was the culprit. Justice is served.`
      : `❌ Incorrect. ${suspect.name} was innocent. The true culprit was ${guilty}. Better luck next time.`
    setMessages((prev) => [...prev, { role: 'system', content: result }])
    setHasAccused(true)
  }

  return (
    <main className="max-w-2xl mx-auto p-4 text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-white">🔍 LLM Whodunnit</h1>

      <div className="flex gap-2 mb-4">
        {suspects.map((s) => (
          <button
            key={s.name}
            onClick={() => setSelected(s)}
            className={`px-3 py-1 rounded border ${selected.name === s.name ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900'}`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <div ref={chatRef} className="space-y-2 max-h-[400px] overflow-y-auto border p-4 rounded-xl bg-gray-100">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded bg-gray-200`}>
            <strong>{m.role === 'user' ? 'You' : m.role === 'system' ? 'Narrator' : `${m.target}`}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded bg-gray-100 text-gray-900"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selected.name} a question...`}
          disabled={hasAccused}
        />
        <button
          type="submit"
          disabled={loading || hasAccused}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>

      {!hasAccused ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-white">Who do you accuse?</h2>
          <div className="flex gap-2">
            {suspects.map((s) => (
              <button
                key={s.name + '-accuse'}
                onClick={() => handleAccuse(s)}
                className="px-4 py-2 rounded bg-red-100 hover:bg-red-300"
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={startGame}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🔁 Play Again
          </button>
        </div>
      )}
    </main>
  )
}
