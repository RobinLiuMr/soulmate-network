export default function ProfilePicture({ clickFuncProps, url }) {
    return (
        <div className="profile_picture">
            <img
                className="avatar"
                onClick={clickFuncProps}
                src={url || "https://via.placeholder.com/400.jpg?text=avatar"}
            ></img>
        </div>
    );
}
