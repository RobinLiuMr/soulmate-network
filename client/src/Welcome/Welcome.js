import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <BrowserRouter>
                <Route path="/" exact>
                    <LoginForm />
                </Route>

                <Route path="/register">
                    <RegisterForm />
                </Route>

                <Route path="/reset">
                    <ResetPassword />
                </Route>
            </BrowserRouter>
        </div>
    );
}
