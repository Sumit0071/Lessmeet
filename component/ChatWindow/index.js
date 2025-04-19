// component/ChatWindow/index.js
import styles from "./index.module.css";

const ChatWindow = ({ messages }) => {
  return (
    <div className={styles.chatWindow}>
      {messages.map((msg, idx) => (
        <div key={idx} className={styles.message}>
          <span className={styles.user}>{msg.userId}:</span> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
