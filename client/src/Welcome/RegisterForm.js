import { Component } from "react";
import { Link } from "react-router-dom";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.state = {
            error: false,
        };
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
            .then((data) => {
                if (data.error) {
                    this.setState({
                        error: data.error,
                    });
                } else {
                    window.location.href = "/";
                }
            })
            .catch((error) => console.log("post RegisterForm error", error));
    }

    render() {
        return (
            <div className="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                {/* based on open source from https://www.hyperui.dev/ */}
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold text-center text-indigo-600 sm:text-3xl">
                        Find you soulmate today!
                    </h1>

                    {this.state.error && (
                        <p className="error">{this.state.error}</p>
                    )}

                    <form
                        onSubmit={this.onFormSubmit}
                        className="p-8 mt-6 mb-0 rounded-lg shadow-2xl space-y-4"
                    >
                        <p className="text-lg font-medium">Register account</p>
                        <div>
                            <label
                                htmlFor="first_name"
                                className="text-sm font-medium"
                            >
                                First Name
                            </label>
                            <div className="relative mt-1">
                                <input
                                    name="first_name"
                                    required
                                    type="first_name"
                                    id="first_name"
                                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter First Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="last_name"
                                className="text-sm font-medium"
                            >
                                Last Name
                            </label>
                            <div className="relative mt-1">
                                <input
                                    name="last_name"
                                    required
                                    type="last_name"
                                    id="last_name"
                                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter Last Name"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <div className="relative mt-1">
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    id="email"
                                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter email"
                                />
                                <span className="absolute inset-y-0 inline-flex items-center right-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    name="password"
                                    required
                                    type="password"
                                    id="password"
                                    className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm"
                                    placeholder="Enter password"
                                />
                                <span className="absolute inset-y-0 inline-flex items-center right-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="block w-full px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                        >
                            Sign up
                        </button>
                        <p className="text-sm text-center text-gray-500">
                            Have an account?
                            <Link className="underline" to="/">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
