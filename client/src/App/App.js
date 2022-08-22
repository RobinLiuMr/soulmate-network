import { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import PictureModal from "./PictureModal";
import Profile from "./Profile";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            showModal: false,
        };

        this.onShowModal = this.onShowModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.setBio = this.setBio.bind(this);
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

    setBio(bioText) {
        this.setState({
            user: {
                ...this.state.user,
                bio: bioText,
            },
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
            <div className="app">
                <div className="header">
                    <img
                        className="logo"
                        src="https://via.placeholder.com/200x100.jpg?text=logo"
                    ></img>
                    <ProfilePicture
                        clickFuncProps={this.onShowModal}
                        userProps={this.state.user}
                    />
                </div>

                <Profile setBio={this.setBio} userProps={this.state.user} />
                <PictureModal
                    modalState={this.state.showModal}
                    closeFuncProps={this.onCloseModal}
                />
            </div>
        );
    }
}
