import { Component } from "react";
import { Link } from "react-router-dom";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();
        const fromData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        fetch(`/api/users`, {
            method: "POST",
            body: JSON.stringify(fromData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((newUser) => {
                console.log({ newUser });
                window.location.href = "/";
            })
            .catch((error) => console.log("post RegisterForm error", error));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        name="first_name"
                        required
                        placeholder="First Name"
                    ></input>
                    <input
                        name="last_name"
                        required
                        placeholder="Last Name"
                    ></input>
                    <input name="email" required placeholder="Email"></input>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                    ></input>
                    <button>Register</button>
                </form>
                <Link to="/login">Click here to log in.</Link>
            </div>
        );
    }
}
