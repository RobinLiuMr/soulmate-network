import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            draftBio: "",
            showEdit: false,
        };

        this.onAddOrEdit = this.onAddOrEdit.bind(this);
        this.onLaterEdit = this.onLaterEdit.bind(this);
        this.onSave = this.onSave.bind(this);
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

    onSave(event) {
        event.preventDefault();

        this.props.setBio("My new bio!!");
    }

    render() {
        if (!this.props.bio) {
            return (
                <div className="bio_editor">
                    <button onClick={this.onAddOrEdit}>Add Bio</button>
                    {this.state.showEdit && (
                        <form className="edit_profile">
                            <textarea></textarea>
                            <button onClick={this.onSave}>Save</button>
                            <button onClick={this.onLaterEdit}>later</button>
                        </form>
                    )}
                </div>
            );
        } else {
            return (
                <div className="bio_editor">
                    {this.props.bio}
                    <button onClick={this.onAddOrEdit}>Edit Bio</button>
                    {this.state.showEdit && (
                        <form className="edit_profile">
                            <textarea></textarea>
                            <button>Save</button>
                            <button onClick={this.onLaterEdit}>later</button>
                        </form>
                    )}
                </div>
            );
        }
    }
}
