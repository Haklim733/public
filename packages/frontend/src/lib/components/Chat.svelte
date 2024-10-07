"use client";

import mqtt from "mqtt";
import { useState, useEffect } from "react";
import styles from "./chat.module.css";

export default function Chat(
  { topic, endpoint, authorizer }: { topic: string, endpoint: string, authorizer: string }
) {
  const [messages, setMessages] = useState<string[]>([]);
  const [connection, setConnection] = useState<mqtt.MqttClient | null>(null);

  return (
    <div className={styles.chat}>
      {connection && messages.length > 0 &&
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      }
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();

          const input = (e.target as HTMLFormElement).message;

          connection!.publish(topic, input.value, { qos: 1 });
          input.value = "";
        }}
      >
        <input
          required
          autoFocus
          type="text"
          name="message"
          placeholder={
            connection ? "Ready! Say hello..." : "Connecting..."
          }
        />
        <button type="submit" disabled={connection === null}>Send</button>
      </form>
    </div>
  );
}
useEffect(() => {
  const connection = createConnection(endpoint, authorizer);

  connection.on("connect", async () => {
    try {
      await connection.subscribeAsync(topic, { qos: 1 });
      setConnection(connection);
    } catch (e) { }
  });
  connection.on("message", (_fullTopic, payload) => {
    const message = new TextDecoder("utf8").decode(new Uint8Array(payload));
    setMessages((prev) => [...prev, message]);
  });
  connection.on("error", console.error);

  connection.connect();

  return () => {
    connection.end();
    setConnection(null);
  };
}, [topic, endpoint, authorizer]);