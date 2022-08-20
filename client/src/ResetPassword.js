import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            error: false,
        };

        this.onEmailSubmit = this.onEmailSubmit.bind(this);
        this.onVerifySubmit = this.onVerifySubmit.bind(this);
    }

    onEmailSubmit(event) {
        event.preventDefault();

        const fromData = {
            email: event.target.email.value,
        };

        fetch(`/api/reset/email`, {
            method: "POST",
            body: JSON.stringify(fromData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (data.error) {
                    this.setState({
                        error: data.error,
                    });
                }
            })
            .catch((error) => console.log("post reset email error", error));

        this.setState({
            step: 2,
        });
    }

    onVerifySubmit(event) {
        event.preventDefault();

        const fromData = {
            code: event.target.code.value,
            password: event.target.password.value,
        };

        fetch(`/api/reset/verify`, {
            method: "POST",
            body: JSON.stringify(fromData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (data.error) {
                    this.setState({
                        error: data.error,
                    });
                } else if (data.id) {
                    this.setState({
                        step: 3,
                    });
                }
            })
            .catch((error) => console.log("post verify code error", error));
    }

    render() {
        const stepState = this.state.step;
        let stepDisplay;

        if (stepState === 1) {
            stepDisplay = (
                <div>
                    Reset Password
                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}
                    <p>Please enter the email with which you registered</p>
                    <form onSubmit={this.onEmailSubmit}>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                        ></input>
                        <button>Submit</button>
                    </form>
                </div>
            );
        }
        if (stepState === 2) {
            stepDisplay = (
                <div>
                    Reset Password
                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}
                    <p>Please enter the code you received</p>
                    <form onSubmit={this.onVerifySubmit}>
                        <input name="code" placeholder="Code"></input>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                        ></input>
                        <button>Submit</button>
                    </form>
                </div>
            );
        }
        if (stepState === 3) {
            stepDisplay = (
                <div>
                    Reset Password
                    <p>Success!</p>
                    You can now <Link to="/login">log in</Link> with your new
                    password.
                </div>
            );
        }

        return <div className="reset">{stepDisplay}</div>;
    }
}
