import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function FriendshipButton() {
    const { user_id } = useParams();
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        fetch(`/api/friendships/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data.text);
            });
    }, []);

    function onHandelClick() {
        fetch(`/api/friendships/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data.text);
            });
    }

    return (
        <div className="friendship">
            <button onClick={onHandelClick}>{buttonText}</button>
        </div>
    );
}
