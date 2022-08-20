import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to the social network!</h1>
            <BrowserRouter>
                <Route path="/" exact>
                    <RegisterForm />
                </Route>

                <Route path="/login">
                    <LoginForm />
                </Route>

                <Route path="/reset">
                    <ResetPassword />
                </Route>
            </BrowserRouter>
        </div>
    );
}
