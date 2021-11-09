import React from "react";
import "./styles/App.css";
import Axios from "axios";
import { TaskTemplate } from "./components/task";
import Tasks from "./components/tasks";
import NavBar from "./components/navbar";
import Popup, { messages } from "./components/popup";
//
interface AppState {
    tasks: TaskTemplate[];
    currentText: string;
    popup: messages;
}

class App extends React.Component {
    state: AppState = {
        tasks: [],
        currentText: "",
        popup: messages.none,
    };

    componentDidMount = () => {
        Axios.get("http://localhost:3001/api/get").then(response => {
            this.setState({ tasks: response.data });
        });
    };

    maxId = (): number => {
        return this.state.tasks.reduce(
            (max, character) => (character.id > max ? character.id : max),
            0
        );
    };

    handleText = (currentText: string): void => {
        this.setState({ currentText });
    };

    handleAdd = async () => {
        if (this.state.currentText) {
            const tasks = [...this.state.tasks];
            const newTask: TaskTemplate = {
                id: this.maxId() + 1,
                description: this.state.currentText,
                checked: false,
            };
            tasks.push(newTask);
            await Axios.post("http://localhost:3001/api/add", newTask);
            this.setState({ tasks: tasks, currentText: "" });
        }
    };

    handleReset = (): void => {
        this.setState({
            popup: messages.reset,
        });
    };

    reset = async () => {
        const tasks = [...this.state.tasks];
        tasks.forEach(t => {
            t.checked = false;
        });
        await Axios.put("http://localhost:3001/api/reset");
        this.setState({ tasks: tasks, popup: messages.none });
    };

    handleDeleteDone = (): void => {
        this.setState({
            popup: messages.deleteDone,
        });
    };

    deleteDone = async () => {
        const tasks = this.state.tasks.filter(t => !t.checked);
        await Axios.delete("http://localhost:3001/api/deleteDone");
        this.setState({ tasks: tasks, popup: messages.none });
    };

    handleClear = (): void => {
        this.setState({
            popup: messages.clear,
        });
    };

    clear = async () => {
        await Axios.delete("http://localhost:3001/api/clear");
        this.setState({ tasks: [], popup: messages.none });
    };

    handleDelete = async (id: number) => {
        const tasks = this.state.tasks.filter(t => t.id !== id);
        await Axios.delete("http://localhost:3001/api/delete", { id: id });
        this.setState({ tasks });
    };

    handleToggle = async (id: number) => {
        const tasks = [...this.state.tasks];
        tasks.forEach(t => {
            if (t.id === id) t.checked = !t.checked;
        });
        await Axios.put("http://localhost:3001/api/toggle", { id: id });
        this.setState({ tasks });
    };

    handlePopupCancle = (): void => {
        this.setState({ popup: messages.none });
    };

    handleYes = (): void => {
        switch (this.state.popup) {
            case messages.reset:
                this.reset();
                break;
            case messages.deleteDone:
                this.deleteDone();
                break;
            case messages.clear:
                this.clear();
                break;
        }
    };

    render() {
        return (
            <div className="app">
                <Popup
                    type={this.state.popup}
                    onCancel={this.handlePopupCancle}
                    onYes={this.handleYes}
                ></Popup>
                <NavBar
                    value={this.state.currentText}
                    numTasks={this.state.tasks.length}
                    numDoneTasks={
                        this.state.tasks.filter(t => t.checked).length
                    }
                    onText={this.handleText}
                    onAdd={this.handleAdd}
                    onReset={this.handleReset}
                    onDeleteDone={this.handleDeleteDone}
                    onClear={this.handleClear}
                />
                <Tasks
                    tasks={this.state.tasks}
                    onDelete={this.handleDelete}
                    onToggle={this.handleToggle}
                />
            </div>
        );
    }
}

export default App;
