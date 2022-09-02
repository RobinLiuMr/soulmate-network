import { Component } from "react";
import { Link } from "react-router-dom";
import StepEmail from "./StepEmail";

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
                } else if (data.id) {
                    this.setState({
                        step: 2,
                        error: false,
                    });
                }
            })
            .catch((error) => console.log("post reset email error", error));
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
                        error: false,
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
                    <StepEmail />
                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}

                    <div className="max-w-2xl mx-auto">
                        <p className="ml-0.5 mb-4 text-lg">
                            Please enter the email with which you registered.
                        </p>
                        <form
                            key={stepState}
                            onSubmit={this.onEmailSubmit}
                            className="relative"
                        >
                            <label className="sr-only" htmlFor="email">
                                {" "}
                                Email{" "}
                            </label>
                            <input
                                className="w-full py-4 pl-3 pr-16 text-sm border-2 border-gray-200 rounded-lg"
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="Email"
                            />
                            <button className="absolute p-2 text-white bg-blue-600 rounded-full -translate-y-1/2 top-1/2 right-4">
                                <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
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
                    <form key={stepState} onSubmit={this.onVerifySubmit}>
                        <label>
                            Code:
                            <input
                                id="code"
                                name="code"
                                placeholder="Code"
                            ></input>
                        </label>
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
