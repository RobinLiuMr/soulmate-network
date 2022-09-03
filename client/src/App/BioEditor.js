import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // draftBio: "", // live display of textarea input TBD
            showEdit: false,
            error: false,
        };

        this.onAddOrEdit = this.onAddOrEdit.bind(this);
        this.onLaterEdit = this.onLaterEdit.bind(this);
        this.onSave = this.onSave.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    onAddOrEdit() {
        this.setState({
            showEdit: true,
        });
    }

    onLaterEdit(event) {
        event.preventDefault();
        this.setState({
            showEdit: false,
        });
    }

    // handleChange(event) {
    //     this.setState({
    //         draftBio: event.target.value,
    //     });
    // }

    onSave(event) {
        event.preventDefault();

        const fromData = {
            bio: event.target.bio.value,
        };

        fetch(`/api/users/bio`, {
            method: "POST",
            body: JSON.stringify(fromData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("fetch /api/users/bio", data);
                if (data.error) {
                    this.setState({
                        error: data.error,
                    });
                } else {
                    this.props.setBio(data.bio);
                    this.setState({
                        showEdit: false,
                    });
                }
            })
            .catch((error) => console.log("fetch /api/users/bio", error));
    }

    render() {
        if (!this.props.bio) {
            return (
                <div className="bio_editor">
                    {!this.state.showEdit && (
                        <div>
                            <button onClick={this.onAddOrEdit}>Add Bio</button>
                        </div>
                    )}

                    {this.state.showEdit && (
                        <div>
                            <form
                                className="edit_profile"
                                onSubmit={this.onSave}
                            >
                                <textarea
                                    className="border-2 border-gray-500"
                                    name="bio"
                                    rows="5"
                                    cols="30"
                                ></textarea>
                                <div className="flex flex-row justify-around">
                                    <button className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-4">
                                        Save
                                    </button>
                                    <button
                                        className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-4"
                                        onClick={this.onLaterEdit}
                                    >
                                        Later
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}
                </div>
            );
        } else {
            return (
                <div className="bio_editor">
                    {!this.state.showEdit && (
                        <div className="flex flex-col  items-center">
                            <p>{this.props.bio}</p>
                            <button
                                className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-4"
                                onClick={this.onAddOrEdit}
                            >
                                Edit Bio
                            </button>
                        </div>
                    )}

                    {this.state.showEdit && (
                        <div>
                            <form
                                className="edit_profile"
                                onSubmit={this.onSave}
                            >
                                <textarea
                                    className="border-2 border-gray-500"
                                    name="bio"
                                    rows="5"
                                    cols="30"
                                ></textarea>
                                <div className="flex flex-row justify-around">
                                    <button className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-4">
                                        Save
                                    </button>
                                    <button
                                        className="block px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition rounded-md mt-4"
                                        onClick={this.onLaterEdit}
                                    >
                                        Later
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}
                </div>
            );
        }
    }
}
