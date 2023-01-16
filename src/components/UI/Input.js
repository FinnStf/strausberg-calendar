import styles from './Input.module.css'

function Input(props) {
    return (
        <div className={`${styles.inputbox} ${styles[props.styles]}`}>
            {props.label && <span>{props.label}</span>}
            <input {...props.input}/>
        </div>
    )
}

export default Input;