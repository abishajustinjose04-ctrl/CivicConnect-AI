
import { useState } from "react";
import { Link } from "react-router-dom";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello! I'm CivicConnect AI. I can help you find the right civic service, understand complaint procedures, and guide you through the complaint process."
    }
  ]);

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: trimmedMessage
      },
      {
        sender: "ai",
        text:
          "Thanks for your message. AI assistance will be connected to the CivicConnect backend soon."
      }
    ]);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <main className="ai-page">

      {/* HEADER */}
      <section className="ai-header">

        <div className="ai-header-content">

          <span>SMART CIVIC ASSISTANCE</span>

          <h1>CivicConnect AI Assistant</h1>

          <p>
            Get guidance on civic services, complaints, departments, and
            public services.
          </p>

        </div>

        <div className="ai-status">
          <span className="ai-status-dot"></span>
          AI Assistant
        </div>

      </section>


      {/* MAIN */}
      <section className="ai-container">

        <div className="ai-chat-card">

          {/* CHAT HEADER */}
          <div className="ai-chat-header">

            <div className="ai-avatar">
              AI
            </div>

            <div>
              <h2>CivicConnect Assistant</h2>
              <span>Available to help citizens</span>
            </div>

          </div>


          {/* MESSAGES */}
          <div className="ai-messages">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`ai-message-row ${
                  item.sender === "user"
                    ? "user-message-row"
                    : "ai-message-row"
                }`}
              >

                {item.sender === "ai" && (
                  <div className="small-ai-avatar">
                    AI
                  </div>
                )}

                <div
                  className={
                    item.sender === "user"
                      ? "user-message"
                      : "ai-message"
                  }
                >
                  {item.text}
                </div>

              </div>

            ))}

          </div>


          {/* INPUT */}
          <div className="ai-input-area">

            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CivicConnect AI..."
            />

            <button
              type="button"
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

          <p className="ai-disclaimer">
            CivicConnect AI provides general guidance. Official decisions
            and complaint actions are handled by the relevant government
            department.
          </p>

        </div>


        {/* SIDEBAR */}
        <aside className="ai-sidebar">

          <div className="ai-side-card">

            <span>TRY ASKING</span>

            <h3>Popular Questions</h3>

            <button
              type="button"
              onClick={() =>
                setMessage("Which department handles garbage collection?")
              }
            >
              Which department handles garbage collection?
            </button>

            <button
              type="button"
              onClick={() =>
                setMessage("How can I track my complaint?")
              }
            >
              How can I track my complaint?
            </button>

            <button
              type="button"
              onClick={() =>
                setMessage("How do I register a civic complaint?")
              }
            >
              How do I register a civic complaint?
            </button>

            <button
              type="button"
              onClick={() =>
                setMessage("My street light is not working. What should I do?")
              }
            >
              My street light is not working. What should I do?
            </button>

          </div>


          <div className="ai-side-card">

            <span>QUICK LINKS</span>

            <h3>Civic Services</h3>

            <Link to="/complaints">
              Register Complaint →
            </Link>

            <Link to="/track-complaint">
              Track Complaint →
            </Link>

            <Link to="/departments">
              Browse Departments →
            </Link>

          </div>


          <div className="ai-side-card ai-help-card">

            <span>NEED MORE HELP?</span>

            <h3>Contact CivicConnect</h3>

            <p>
              If you need assistance that the AI assistant cannot provide,
              contact the CivicConnect support team.
            </p>

            <Link to="/contact">
              Contact Support →
            </Link>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default AIAssistant;

