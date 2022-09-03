import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import FriendshipButton from "./FriendshipButton";

export default function OtherProfile() {
    let history = useHistory();

    const { user_id } = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch(`/api/users/${user_id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error);
                    history.push("/");
                } else {
                    setUser(data);
                }
            });
    }, []);

    return (
        <div className="other_profile flex flex-col gap-8 items-center">
            <div
                className="profile flex flex-col gap-4 items-center w-fit"
                key={user.id}
            >
                <img
                    src={
                        user.profile_picture_url ||
                        "https://via.placeholder.com/264x280.jpg?text=avatar"
                    }
                ></img>
                <p>
                    {user.first_name} {user.last_name}
                </p>
                <p>{user.bio}</p>
            </div>
            <FriendshipButton />
        </div>
    );
}
