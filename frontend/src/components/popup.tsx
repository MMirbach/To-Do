import React from "react";
import "../styles/popup.css";

export enum messages {
    reset = "Are you sure you want to uncheck all tasks?",
    deleteDone = "Are you sure you want to delete all checked tasks?",
    clear = "Are you sure you want to delete all tasks?",
    none = "",
}

interface PopupProps {
    type: messages;
    onYes: () => void;
    onCancel: () => void;
}

class Popup extends React.Component<PopupProps> {
    render() {
        return this.props.type ? (
            <div className="popup-bg">
                <div className="popup-window">
                    <div className="text">{this.props.type}</div>
                    <div className="btns">
                        <button
                            className="btn yes-btn"
                            onClick={() => this.props.onYes()}
                        >
                            Yes
                        </button>
                        <button
                            className="btn cancel-btn"
                            onClick={this.props.onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            ""
        );
    }
}

export default Popup;
