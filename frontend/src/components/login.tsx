import React from "react";
import axios from "axios";
import "../styles/login.css";
import "../styles/popup.css";
const coder = require("../coder");
enum warnings {
    wrong = "* Your username or password were incorrect",
    exists = "* That username is already taken, please try another one",
    unknown = "* Some unknown error occured, please try again",
    none = "",
}

interface LoginProps {
    show: boolean;
    onLogin: (username: string) => void;
}

interface LoginState {
    username: string;
    password: string;
    error: warnings;
}

class Login extends React.Component<LoginProps> {
    state: LoginState = {
        username: "",
        password: "",
        error: warnings.none,
    };

    handleTextUsername = (username: string): void => {
        this.setState({ username });
    };

    handleTextPassword = (password: string): void => {
        this.setState({ password });
    };

    handleLogin = async () => {
        const user = {
            username: this.state.username,
            password: this.state.password,
        };

        const response = await axios.get("http://localhost:3001/api/login", {
            params: user,
        });

        let warning = warnings.none;
        if (response.data) {
            localStorage.setItem("user", this.state.username);
            this.props.onLogin(this.state.username);
        } else if (response.data === false) warning = warnings.wrong;
        else warning = warnings.unknown;

        this.setState({ username: "", password: "", error: warning });
    };

    handleSignUp = async () => {
        let warning = warnings.none;
        const user = {
            username: this.state.username,
            password: this.state.password,
        };

        const response = await axios.post(
            "http://localhost:3001/api/signup",
            user
        );

        if (response.data) {
            localStorage.setItem("user", this.state.username);
            this.props.onLogin(this.state.username);
        } else if (response.data === false) {
            warning = warnings.exists;
        } else warning = warnings.unknown;
        this.setState({ username: "", password: "", error: warning });
    };

    render() {
        return this.props.show ? (
            <div className="popup-bg">
                <div className="popup-window">
                    <div className="error">{this.state.error}</div>
                    <div className="text">
                        Please enter your credentials to either login or sign up
                    </div>
                    <div className="inputs">
                        <input
                            className="text-box"
                            placeholder="Username"
                            autoFocus={true}
                            type="text"
                            maxLength={25}
                            value={this.state.username}
                            onChange={l =>
                                this.handleTextUsername(l.target.value)
                            }
                        />
                        <input
                            className="text-box"
                            placeholder="Password"
                            type="password"
                            maxLength={25}
                            value={this.state.password}
                            onChange={l =>
                                this.handleTextPassword(l.target.value)
                            }
                        />
                    </div>
                    <div className="btns">
                        <button
                            className="btn login-btn"
                            onClick={this.handleLogin}
                        >
                            Login
                        </button>
                        <button className="btn" onClick={this.handleSignUp}>
                            Sign-Up
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            ""
        );
    }
}

export default Login;
