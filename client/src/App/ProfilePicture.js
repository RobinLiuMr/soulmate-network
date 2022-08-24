export default function ProfilePicture({ clickFuncProps, userProps }) {
    return (
        <div className="profile_picture">
            <img
                className="avatar"
                onClick={clickFuncProps}
                src={false || "https://via.placeholder.com/400.jpg?text=avatar"}
            ></img>
            {/* false replaced with your {userProps.profile_picture_url} */}
        </div>
    );
}
