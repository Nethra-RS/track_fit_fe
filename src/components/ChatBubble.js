import React, { useState, useEffect, useRef } from "react";
import "./ChatBubble.css";
import API_BASE_URL from "../lib/api";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatMessagesRef = useRef(null);
  const messageEndRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const toggleChat = () => setOpen(prev => !prev);
  const closeChat = () => setOpen(false);

  const fetchSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoadingSession(false);
    }
  };

  const fetchMessages = async (prepend = false) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${API_BASE_URL}/api/chat?limit=10`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      const newMessages = data.messages.reverse();
      console.log("Fetched messages:", newMessages.map(m => m.id));

      const newUniqueMessages = newMessages.filter(m => !messageIdsRef.current.has(m.id));

      newUniqueMessages.forEach(m => messageIdsRef.current.add(m.id));

      if (newUniqueMessages.length > 0) {
        setMessages(prev =>
          prepend ? [...newUniqueMessages, ...prev] : [...prev, ...newUniqueMessages]
        );
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email: user?.email, message }),
      });
      const data = await res.json();
      setMessage("");
      const newMsg = data.message;
      if (!messageIdsRef.current.has(newMsg.id)) {
        setMessages(prev => [...prev, newMsg]);
        messageIdsRef.current.add(newMsg.id);
      }
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    });
  };

  const handleScroll = () => {
    if (!chatMessagesRef.current || loadingOlder) return;
    if (chatMessagesRef.current.scrollTop === 0) {
      setLoadingOlder(true);
      fetchMessages(true).then(() => setLoadingOlder(false));
    }
  };

  useEffect(() => {
    if (open) {
      fetchSession();
    }
  }, [open]);

  useEffect(() => {
    let interval;
    if (open && user) {
      setMessages([]);
      messageIdsRef.current.clear();
      fetchMessages(true).then(() => scrollToBottom());
      interval = setInterval(() => {
        fetchMessages();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [open, user]);

  return (
    <div className="chat-container">
      <button className="chat-toggle" onClick={toggleChat}>💬</button>

      {open && !loadingSession && (
        <div className="chat-box animated">
          <div className="chat-header">
            Chat with TrackFit. Users
            <span className="chat-close" onClick={closeChat}>×</span>
          </div>

          <div className="chat-body">
            <div className="chat-messages-wrapper">
              <div
                className="chat-messages"
                ref={chatMessagesRef}
                onScroll={handleScroll}
              >
                {user ? (
                  <>
                    {(loadingMessages || loadingOlder) && (
                      <div className="text-center text-muted small mb-2">
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Loading messages…
                      </div>
                    )}
                    {messages.map((msg) => (
                      <div key={`msg-${msg.id}`} className="chat-msg mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{msg.username}</strong>
                          <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div>{msg.message}</div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </>
                ) : (
                  <div className="text-center text-muted mt-4 mb-4 px-3">
                    Log in to chat and announce your achievements!
                  </div>
                )}
              </div>

              {!user && (
                <div className="chat-login-overlay">
                  Please <a href="/signin">Log In</a> or <a href="/signup">Sign Up</a> to chat with others.
                </div>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={user ? "Share your achievements..." : "Log in / Sign up to use chat"}
                disabled={!user}
              />
              <button onClick={sendMessage} disabled={!user || !message.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;







