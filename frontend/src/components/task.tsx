import React from "react";
import "../styles/task.css";
import bin from "../images/cute-bin.png";

export type TaskTemplate = {
    id: number;
    description: string;
    checked: boolean;
};

interface TaskProps {
    task: TaskTemplate;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

class Task extends React.Component<TaskProps> {
    render() {
        return (
            <div className="task">
                <button
                    className="delete-btn"
                    onClick={() => this.props.onDelete(this.props.task.id)}
                >
                    <img src={bin} alt="delete" className="bin" />
                </button>
                <div
                    className={
                        this.props.task.checked
                            ? "check-box-wrapper checked-box"
                            : "check-box-wrapper"
                    }
                >
                    <input
                        type="checkbox"
                        checked={this.props.task.checked}
                        onChange={() => this.props.onToggle(this.props.task.id)}
                        className="check-box"
                    />
                </div>
                <span
                    className={
                        this.props.task.checked ? "text checked-text" : "text"
                    }
                    style={
                        this.props.task.checked
                            ? { textDecoration: "line-through" }
                            : {}
                    }
                >
                    {this.props.task.description}
                </span>
            </div>
        );
    }
}

export default Task;
