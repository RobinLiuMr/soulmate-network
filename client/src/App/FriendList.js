export default function FriendList({ friendships, onClick }) {
    return (
        <ul>
            {friendships.map((f) => (
                <li key={f.user_id}>
                    <a href={"/users/" + f.user_id}>
                        <img src={f.profile_picture_url}></img>
                        {f.first_name} {f.last_name}
                    </a>

                    <button onClick={() => onClick(f)}>
                        {f.accepted
                            ? "End Friendship"
                            : "Accept Friend Request"}
                    </button>
                </li>
            ))}
        </ul>
    );
}
