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
        <section className="chat mx-auto w-3/4">
            <h2 className="text-lg text-teal-600 mb-4">Soul talk</h2>
            <ul className="messages">
                {chatMessages.map((m) => (
                    <li
                        className="divide-y divide-solid"
                        ref={lastItemRef}
                        key={m.id}
                    >
                        <img src={m.profile_picture_url}></img>
                        {m.first_name} {m.last_name} {formatDate(m.created_at)}
                        <p>{m.message}</p>
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    className="mt-2 border-2 border-gray-500 w-full"
                    name="newMessage"
                    rows="2"
                    cols="80"
                    placeholder="Write your message..."
                    required
                ></textarea>
                <button className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-2">
                    Send
                </button>
            </form>
        </section>
    );
}
