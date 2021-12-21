import React from "react";
import "./styles/App.css";
import Axios from "axios";
import { TaskTemplate } from "./components/task";
import Tasks from "./components/tasks";
import NavBar from "./components/navbar";
import Popup, { messages } from "./components/popup";
import Login from "./components/login";
import { decode } from "./coder";

const coder = require("./coder");

interface AppState {
    tasks: TaskTemplate[];
    currentUser: string;
    popup: messages;
    loggedIn: boolean;
    isMenuOpen: boolean;
}

class App extends React.Component {
    state: AppState = {
        tasks: [],
        currentUser: "",
        popup: messages.none,
        loggedIn: true,
        isMenuOpen: false,
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
            await Axios.post(
                "http://132.69.8.12:443/api/add",
                coder.encode({
                    description: text,
                    username: this.state.currentUser,
                })
            ).then(res => {
                const decoded = decode(res.data);
                const tasks = [...this.state.tasks];
                const newTask: TaskTemplate = {
                    id: decoded["id"],
                    description: text,
                    checked: false,
                };
                tasks.push(newTask);
                this.setState({ tasks });
            });
        }
    };

    handleToggleMenu = (): void => {
        var isMenuOpen = !this.state.isMenuOpen;
        this.setState({ isMenuOpen });
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
            "http://132.69.8.12:443/api/reset",
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
        await Axios.delete("http://132.69.8.12:443/api/deleteDone", {
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
        await Axios.delete("http://132.69.8.12:443/api/clear", {
            data: coder.encode({ username: this.state.currentUser }),
        });
        this.setState({ tasks: [], popup: messages.none });
    };

    handleDelete = async (id: number) => {
        const tasks = this.state.tasks.filter(t => t.id !== id);
        await Axios.delete("http://132.69.8.12:443/api/delete", {
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
            "http://132.69.8.12:443/api/toggle",
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
        this.setState({ isMenuOpen: false });
    };

    updateCurrentUser = async (username: string) => {
        await Axios.get("http://132.69.8.12:443/api/getTasks", {
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
                    isMenuOpen={this.state.isMenuOpen}
                    onAdd={this.handleAdd}
                    onReset={this.handleReset}
                    onDeleteDone={this.handleDeleteDone}
                    onClear={this.handleClear}
                    onLogout={this.handleLogout}
                    onToggleMenu={this.handleToggleMenu}
                />
                <div className="list-div">
                    <Tasks
                        tasks={this.state.tasks}
                        onDelete={this.handleDelete}
                        onToggle={this.handleToggle}
                    />
                </div>
            </div>
        );
    }
}

export default App;
