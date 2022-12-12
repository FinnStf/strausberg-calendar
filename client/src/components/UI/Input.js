import styles from './Input.module.css'

function Input(props) {
    return (
        <div className={styles.inputbox}>
            {props.label && <span>{props.label}</span>}
            <input className={styles[props.styles]} {...props.input}/>
        </div>
    )
}

export default Input;