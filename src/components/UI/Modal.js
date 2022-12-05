import styles from './Modal.module.css';
import {Fragment} from "react";
import ReactDOM from "react-dom";

function Backdrop(props) {
    return (
        <div onClick={props.handleClick} className={`${styles.backdrop} ${styles[props.style]}`}></div>
    )
}

function Overlay(props) {
    return (
        <div className={`${styles.modal} ${styles[props.style]}`}>
            {props.children}
        </div>
    )
}

function Modal(props) {
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop style={props.style} handleClick={props.handleClick}/>, document.getElementById("modal-root"))}
            {ReactDOM.createPortal(<Overlay style={props.style}>{props.children}</Overlay>, document.getElementById("modal-root"))}
        </Fragment>
    )
}

export default Modal;