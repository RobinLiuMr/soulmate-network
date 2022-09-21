export default function FriendList({ friendships, onClick }) {
    return (
        <ul>
            {friendships.map((f) => (
                <li className="flex gap-8 items-center" key={f.user_id}>
                    <a href={"/users/" + f.user_id}>
                        <img
                            src={
                                f.profile_picture_url ||
                                "https://via.placeholder.com/264x280.jpg?text=avatar"
                            }
                        ></img>
                        <p className="text-center">
                            {f.first_name} {f.last_name}
                        </p>
                    </a>

                    <button
                        className="h-10 block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md"
                        onClick={() => onClick(f)}
                    >
                        {f.accepted
                            ? "End Friendship"
                            : "Accept Friend Request"}
                    </button>
                </li>
            ))}
        </ul>
    );
}
