import ProfilePicture from "./ProfilePicture";
import BioEditor from "./BioEditor";

export default function Profile({ userProps, setBio }) {
    return (
        <div className="profile">
            <ProfilePicture />
            <strong>
                {userProps.first_name} {userProps.last_name}
            </strong>
            <BioEditor bio={userProps.bio} setBio={setBio} />
        </div>
    );
}
