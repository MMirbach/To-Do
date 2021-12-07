import React from "react";
import "./styles/App.css";
import Axios from "axios";
import { TaskTemplate } from "./components/task";
import Tasks from "./components/tasks";
import NavBar from "./components/navbar";
import Popup, { messages } from "./components/popup";
import Login from "./components/login";

const coder = require("./coder");

interface AppState {
    tasks: TaskTemplate[];
    currentUser: string;
    popup: messages;
    loggedIn: boolean;
}

class App extends React.Component {
    state: AppState = {
        tasks: [],
        currentUser: "",
        popup: messages.none,
        loggedIn: true,
    };

    componentDidMount = async () => {
        //localStorage.clear();
        const username = localStorage.getItem("user");
        if (username === null) this.setState({ loggedIn: false });
        else this.updateCurrentUser(coder.decode(username));
    };

    maxId = (): number => {
        return this.state.tasks.reduce(
            (max, character) => (character.id > max ? character.id : max),
            0
        );
    };

    handleAdd = async (text: string) => {
        if (text) {
            const tasks = [...this.state.tasks];
            const newTask: TaskTemplate = {
                id: this.maxId() + 1,
                description: text,
                checked: false,
            };
            tasks.push(newTask);
            await Axios.post(
                "http://localhost:3001/api/add",
                coder.encode({
                    task: newTask,
                    username: this.state.currentUser,
                })
            );
            this.setState({ tasks });
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
        await Axios.put(
            "http://localhost:3001/api/reset",
            coder.encode({
                username: this.state.currentUser,
            })
        );
        this.setState({ tasks: tasks, popup: messages.none });
    };

    handleDeleteDone = (): void => {
        this.setState({
            popup: messages.deleteDone,
        });
    };

    deleteDone = async () => {
        const tasks = this.state.tasks.filter(t => !t.checked);
        await Axios.delete("http://localhost:3001/api/deleteDone", {
            data: coder.encode({ username: this.state.currentUser }),
        });
        this.setState({ tasks: tasks, popup: messages.none });
    };

    handleClear = (): void => {
        this.setState({
            popup: messages.clear,
        });
    };

    clear = async () => {
        await Axios.delete("http://localhost:3001/api/clear", {
            data: coder.encode({ username: this.state.currentUser }),
        });
        this.setState({ tasks: [], popup: messages.none });
    };

    handleDelete = async (id: number) => {
        const tasks = this.state.tasks.filter(t => t.id !== id);
        await Axios.delete("http://localhost:3001/api/delete", {
            data: coder.encode({ id: id }),
        });
        this.setState({ tasks });
    };

    handleToggle = async (id: number) => {
        const tasks = [...this.state.tasks];
        tasks.forEach(t => {
            if (t.id === id) t.checked = !t.checked;
        });
        await Axios.put(
            "http://localhost:3001/api/toggle",
            coder.encode({ id: id })
        );
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
            case messages.logout:
                this.logout();
                break;
        }
    };

    updateCurrentUser = async (username: string) => {
        await Axios.get("http://localhost:3001/api/get", {
            params: coder.encode({ username: username }),
        }).then(response => {
            this.setState({
                tasks: coder.decode(response.data),
                currentUser: username,
                loggedIn: true,
            });
        });
    };

    handleLogout = (): void => {
        this.setState({
            popup: messages.logout,
        });
    };

    logout = (): void => {
        localStorage.clear();
        this.setState({
            tasks: [],
            currentUser: "",
            popup: messages.none,
            loggedIn: false,
        });
    };

    render() {
        return (
            <div className="app">
                <Login
                    show={!this.state.loggedIn}
                    onLogin={this.updateCurrentUser}
                ></Login>
                <Popup
                    type={this.state.popup}
                    onCancel={this.handlePopupCancle}
                    onYes={this.handleYes}
                ></Popup>
                <NavBar
                    inactive={
                        this.state.popup.length > 0 || !this.state.loggedIn
                    }
                    numTasks={this.state.tasks.length}
                    numDoneTasks={
                        this.state.tasks.filter(t => t.checked).length
                    }
                    onAdd={this.handleAdd}
                    onReset={this.handleReset}
                    onDeleteDone={this.handleDeleteDone}
                    onClear={this.handleClear}
                    onLogout={this.handleLogout}
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
