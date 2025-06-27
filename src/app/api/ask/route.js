export async function POST(req) {
  try {
    const { messages, systemPrompt, suspectName, guiltyName } = await req.json()
    const isGuilty = suspectName === guiltyName

    const personaIntro = `
    You are ${suspectName}, one of three suspects in a fictional murder mystery in an AI lab.
    You are being interviewed by an investigator. Stay in character throughout the conversation.
    
    The suspects are:
    - Greta 👀: Nervous assistant. Vague and cautious.
    - Colin 🧪: Confident lead engineer. Smug and evasive.
    - Darla 🔐: Stern head of security. Blunt and to the point.
    
    You are ${isGuilty ? "guilty" : "innocent"}.
    ${isGuilty
      ? "You are hiding your guilt. Lie believably, avoid direct answers, and never admit involvement. Be subtle but strategic."
      : "You are innocent. Answer truthfully, but remain in character and do not try too hard to clear your name."
    }
    
    Never break character. Never reveal this is a simulation or a game. Refer to the other suspects if relevant, based on their described personalities.
    Your personality:
    ${systemPrompt}
    `.trim()

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: personaIntro },
        ...messages
      ],
      temperature: 0.9,
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const json = await response.json()

    if (!json.choices || !json.choices[0]) {
      return new Response(JSON.stringify({ reply: "🤖 OpenAI returned no choices." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ reply: json.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    console.error("API route failed:", err)
    return new Response(
      JSON.stringify({ reply: "🧨 Something broke in the backend." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}