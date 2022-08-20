import { Component } from "react";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            showModal: false,
        };

        this.onShowModal = this.onShowModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    onShowModal() {
        this.setState({
            showModal: true,
        });
    }

    onCloseModal() {
        this.setState({
            showModal: false,
        });
    }

    componentDidMount() {
        //fetches the logged user info
        fetch("/api/users/me")
            .then((response) => response.json())
            .then((user) => {
                console.log("fetch /api/users/me", user);
                this.setState({
                    user: {
                        ...user,
                        profile_picture_url: "default_url",
                    },
                });
            });
    }

    render() {
        return (
            <div className="profile">
                My profile
                <ProfilePicture
                    clickFuncProps={this.onShowModal}
                    userProps={this.state.user}
                />
                {this.state.showModal && (
                    <PictureModal closeFuncProps={this.onCloseModal} />
                )}
            </div>
        );
    }
}

function ProfilePicture({ clickFuncProps, userProps }) {
    return (
        <div className="profile_picture">
            <button onClick={clickFuncProps}>
                {userProps.profile_picture_url}
            </button>
        </div>
    );
}

function PictureModal({ closeFuncProps }) {
    function onFormSubmit(event) {
        event.preventDefault();

        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error uploading avatar!");
                    return;
                }

                // onUpload(data);
                console.log("fetch /api/users/profile ", data);
            });
    }

    return (
        <div className="picture_modal">
            <button onClick={closeFuncProps}>X</button>

            <form onSubmit={onFormSubmit}>
                <input type="file"></input>
            </form>
        </div>
    );
}
