import { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();
        const fromData = {
            email: event.target.email.value,
            password: event.target.password.value,
        };

        fetch(`/api/login`, {
            method: "POST",
            body: JSON.stringify(fromData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((user) => {
                console.log("log user", user);
                window.location.href = "/";
            })
            .catch((error) => console.log("post LoginForm error", error));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                    ></input>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                    ></input>
                    <button>Log in</button>
                </form>
                <Link to="/reset">Forgot you password</Link>
            </div>
        );
    }
}
