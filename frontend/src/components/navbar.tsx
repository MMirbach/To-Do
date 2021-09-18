import React from "react";
import "../styles/navbar.css";

interface NavBarProps {
    value: string;
    numTasks: number;
    numDoneTasks: number;
    onText: (letter: string) => void;
    onAdd: () => void;
    onReset: () => void;
    onDeleteDone: () => void;
    onClear: () => void;
}

class NavBar extends React.Component<NavBarProps> {
    render() {
        return (
            <nav className="navbar">
                <input
                    className="text-box"
                    placeholder="Add Task"
                    autoFocus={true}
                    type="text"
                    maxLength={100}
                    value={this.props.value}
                    onChange={l => this.props.onText(l.target.value)}
                    onKeyPress={k => {
                        if (k.key === "Enter") this.props.onAdd();
                    }}
                />
                <button className="btn add-btn" onClick={this.props.onAdd}>
                    Add
                </button>
                <button
                    className="btn not-add-btn"
                    onClick={this.props.onReset}
                    disabled={!this.props.numDoneTasks}
                >
                    Reset Checked
                </button>
                <button
                    className="btn not-add-btn"
                    onClick={this.props.onDeleteDone}
                    disabled={!this.props.numDoneTasks}
                >
                    Delete Done
                </button>
                <button
                    className="btn not-add-btn"
                    onClick={this.props.onClear}
                    disabled={!this.props.numTasks}
                >
                    Clear
                </button>
            </nav>
        );
    }
}

export default NavBar;
