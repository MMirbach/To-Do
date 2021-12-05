import React from "react";
import Task, { TaskTemplate } from "./task";
import "../styles/tasks.css";

interface TasksProps {
    tasks: TaskTemplate[];
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
}

class Tasks extends React.Component<TasksProps> {
    render() {
        return (
            <ul className="list">
                {this.props.tasks.map(t => (
                    <li key={t.id} className="list-item">
                        <Task
                            //key={t.id} possibly neccessery
                            task={t}
                            onToggle={this.props.onToggle}
                            onDelete={this.props.onDelete}
                        />
                    </li>
                ))}
            </ul>
        );
    }
}

export default Tasks;
