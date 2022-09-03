import ProfilePicture from "./ProfilePicture";
import BioEditor from "./BioEditor";

export default function Profile({ userProps, setBio }) {
    return (
        <div className="profile flex flex-col gap-4 items-center ">
            <ProfilePicture url={userProps.profile_picture_url} />
            <strong>
                {userProps.first_name} {userProps.last_name}
            </strong>
            <BioEditor bio={userProps.bio} setBio={setBio} />
        </div>
    );
}
