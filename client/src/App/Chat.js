import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

let socket;

// lazy initialize pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => (socket = null);

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);
    const lastItemRef = useRef(null);

    useEffect(() => {
        const socket = connect();

        socket.on("recentMessages", onRecentMessages);
        socket.on("broadcastMessage", onBroadcastMessage);

        // cleanup function returned from useEffect
        return () => {
            socket.off("recentMessages", onRecentMessages);
            socket.off("broadcastMessage", onBroadcastMessage);
            disconnect();
        };

        function onRecentMessages(latestMessages) {
            setChatMessages(latestMessages);
        }

        function onBroadcastMessage(newMessage) {
            setChatMessages((chatMessages) => {
                return [...chatMessages, newMessage];
            });
        }
    }, []);

    useEffect(() => {
        if (!lastItemRef.current) {
            return;
        }

        lastItemRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    function onSubmit(event) {
        event.preventDefault();
        const socket = connect();
        socket.emit("newMessage", event.target.newMessage.value);
        event.target.newMessage.value = "";
    }

    return (
        <section className="chat">
            <h2>Chat</h2>
            <ul className="messages">
                {chatMessages.map((m) => (
                    <li ref={lastItemRef} key={m.id}>
                        <img src={m.profile_picture_url}></img>
                        {m.first_name} {m.last_name} {formatDate(m.created_at)}
                        <p>{m.message}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="newMessage"
                    rows="2"
                    cols="50"
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button>Send</button>
            </form>
        </section>
    );
}
