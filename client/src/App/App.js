import { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import PictureModal from "./PictureModal";
import Profile from "./Profile";
import FindPeople from "./FindPeople";
import OtherProfile from "./OtherProfile";

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
        this.onUpload = this.onUpload.bind(this);
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

    onUpload(url) {
        this.setState({
            user: {
                ...this.state.user,
                profile_picture_url: url,
            },
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
                    },
                });
            });
    }

    render() {
        return (
            <BrowserRouter>
                <section className="app">
                    <header>
                        <img
                            className="logo"
                            src="https://via.placeholder.com/200x100.jpg?text=logo"
                        ></img>

                        <nav className="nav">
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/people">Find People</NavLink>
                        </nav>

                        <ProfilePicture
                            clickFuncProps={this.onShowModal}
                            url={this.state.user.profile_picture_url}
                        />
                    </header>
                    <section className="container">
                        <Route path="/" exact>
                            <Profile
                                setBio={this.setBio}
                                userProps={this.state.user}
                            />
                        </Route>

                        <Route path="/users/:user_id">
                            <OtherProfile />
                        </Route>

                        <Route path="/people">
                            <FindPeople />
                        </Route>

                        <PictureModal
                            modalState={this.state.showModal}
                            closeFuncProps={this.onCloseModal}
                            onUpload={this.onUpload}
                        />
                    </section>
                    <footer>some footer</footer>
                </section>
            </BrowserRouter>
        );
    }
}
