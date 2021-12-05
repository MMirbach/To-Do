import React from "react";
import "../styles/login.css";
import "../styles/popup.css";

interface LoginProps {
    show: boolean;
    //onLogin: () => void;
    //onSignUp: () => void;
}

interface LoginState {
    username: string;
    password: string;
    error: boolean;
}

class Login extends React.Component<LoginProps> {
    state: LoginState = {
        username: "",
        password: "",
        error: false,
    };

    handleTextUsername = (username: string): void => {
        this.setState({ username });
    };

    handleTextPassword = (password: string): void => {
        this.setState({ password });
    };

    render() {
        return this.props.show ? (
            <div className="popup-bg">
                <div className="popup-window">
                    <div className="error">
                        {this.state.error
                            ? "* Your username or password were incorrect."
                            : ""}
                    </div>
                    <div className="text">
                        Please enter your credentials to either login or sign up
                    </div>
                    <div className="inputs">
                        <input
                            className="text-box"
                            placeholder="Username"
                            autoFocus={true}
                            type="text"
                            maxLength={100}
                            value={this.state.username}
                            onChange={l =>
                                this.handleTextUsername(l.target.value)
                            }
                        />
                        <input
                            className="text-box"
                            placeholder="Password"
                            type="password"
                            maxLength={100}
                            value={this.state.password}
                            onChange={l =>
                                this.handleTextPassword(l.target.value)
                            }
                        />
                    </div>
                    <div className="btns">
                        <button
                            className="btn login-btn"
                            //onClick={() => this.props.onYes()}
                        >
                            Login
                        </button>
                        <button
                            className="btn"
                            //onClick={this.props.onCancel}
                        >
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
