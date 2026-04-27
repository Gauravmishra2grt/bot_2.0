import { useState, useRef, useEffect } from "react";
import "./Chat.css";

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "Hello. I'm your AI assistant. Ask me anything — I'm here to help.",
    time: formatTime(new Date()),
  },
];

function TypingIndicator() {
  return (
    <div className="message-row bot">
      <div className="avatar bot-avatar">🤖</div>
      <div className="bubble bot-bubble typing-bubble">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      {!isUser && <div className="avatar bot-avatar">🤖</div>}

      <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
        <p>{msg.text}</p>
        <span className="msg-time">{msg.time}</span>
      </div>

      {isUser && <div className="avatar user-avatar">👤</div>}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🔥 MAIN FUNCTION (UPDATED)
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      time: formatTime(new Date()),
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://bot-2-0-9pqh.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.reply,
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);

      const errorMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "⚠️ Error connecting to server",
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);

    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGES[0]]);
  };

  return (
    <div className="chat-shell">
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <div className="header-info">
            <span className="header-title">AI Assistant</span>
            <span className="header-sub">Online</span>
          </div>

          <button className="icon-btn" onClick={clearChat}>
            Clear
          </button>
        </header>

        {/* Messages */}
        <div className="messages-area">
          <div className="messages-inner">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="input-zone">
          <div className="input-shell">
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Send a message..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              rows={1}
            />

            <button
              className={`send-btn ${
                input.trim() && !isTyping ? "active" : ""
              }`}
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}