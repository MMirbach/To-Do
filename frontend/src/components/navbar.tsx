import React from "react";
import "../styles/navbar.css";

interface NavBarProps {
    inactive: boolean;
    numTasks: number;
    numDoneTasks: number;
    onAdd: (text: string) => void;
    onReset: () => void;
    onDeleteDone: () => void;
    onClear: () => void;
    onLogout: () => void;
}

interface NavbarState {
    text: string;
}

class NavBar extends React.Component<NavBarProps> {
    state: NavbarState = {
        text: "",
    };

    handleText = (text: string): void => {
        this.setState({ text });
    };

    handleAdd = (text: string): void => {
        this.setState({ text: "" });
        this.props.onAdd(text);
    };

    render() {
        return (
            <nav className="header">
                <div className="navbar">
                    <input
                        className="text-box"
                        placeholder="Add Task"
                        autoFocus={true}
                        type="text"
                        maxLength={100}
                        disabled={this.props.inactive}
                        value={this.state.text}
                        onChange={l => this.handleText(l.target.value)}
                        onKeyPress={k => {
                            if (k.key === "Enter")
                                this.handleAdd(this.state.text);
                        }}
                    />
                    <button
                        className="btn add-btn"
                        disabled={this.props.inactive}
                        onClick={() => this.handleAdd(this.state.text)}
                    >
                        Add
                    </button>
                    <button
                        className="btn not-add-btn"
                        onClick={this.props.onReset}
                        disabled={
                            !this.props.numDoneTasks || this.props.inactive
                        }
                    >
                        Reset Checked
                    </button>
                    <button
                        className="btn not-add-btn"
                        onClick={this.props.onDeleteDone}
                        disabled={
                            !this.props.numDoneTasks || this.props.inactive
                        }
                    >
                        Delete Done
                    </button>
                    <button
                        className="btn not-add-btn"
                        onClick={this.props.onClear}
                        disabled={!this.props.numTasks || this.props.inactive}
                    >
                        Clear
                    </button>
                </div>
                <div className="logout-div">
                    <button
                        className="btn logout-btn"
                        onClick={this.props.onLogout}
                        disabled={this.props.inactive}
                    >
                        Log Out
                    </button>
                </div>
            </nav>
        );
    }
}

export default NavBar;
