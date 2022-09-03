import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function FriendshipButton() {
    const { user_id } = useParams();
    const [buttonText, setButtonText] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        fetch(`/api/friendships/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data.text);
                data.id ? setId(data.id) : setId(0);
            });
    }, []);

    function onHandelClick() {
        const formData = {
            currentBtnText: buttonText,
            currentId: id,
        };

        fetch(`/api/friendships/${user_id}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setButtonText(data.text);
                setId(data.id);
            });
    }

    return (
        <div className="friendship h-10 block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md">
            <button onClick={onHandelClick}>{buttonText}</button>
        </div>
    );
}
