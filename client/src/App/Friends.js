import { useState, useEffect } from "react";
import FriendList from "./FriendList";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        fetch("/api/friendships")
            .then((response) => response.json())
            .then((data) => {
                setFriendships(data);
            });
    }, []);

    function onClick(friendship) {
        if (friendship.accepted) {
            const newFriendships = friendships.filter(
                (f) => f.friendship_id !== friendship.friendship_id
            );
            setFriendships(newFriendships);
            // send command to server
            const formData = {
                currentBtnText: "End Friendship",
                currentId: friendship.friendship_id,
            };

            fetch(`/api/friendships/${friendship.user_id}`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            const newFriendships = friendships.map((f) => {
                if (f.friendship_id === friendship.friendship_id) {
                    f.accepted = true;
                }

                return f;
            });
            setFriendships(newFriendships);

            // send command to server
            const formData = {
                currentBtnText: "Accept Friend Request",
                currentId: friendship.friendship_id,
            };

            fetch(`/api/friendships/${friendship.user_id}`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    }

    // split the friendships in two groups
    const incoming = friendships.filter((f) => !f.accepted);
    const accepted = friendships.filter((f) => f.accepted);

    console.log("incoming", incoming);
    console.log("accepted", accepted);

    return (
        <section className="friends">
            <h2>Friends</h2>
            <section className="incoming-list">
                <h3>Incoming requests</h3>
                <FriendList friendships={incoming} onClick={onClick} />
            </section>
            <section className="current-list">
                <h3>Current friends</h3>
                <FriendList friendships={accepted} onClick={onClick} />
            </section>
        </section>
    );
}
