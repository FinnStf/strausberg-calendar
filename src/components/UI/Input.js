import styles from './Input.module.css'

function Input(props) {
    return (
        <div className={styles.input}>
            {props.label && <label htmlFor={props.input.id}>{props.label}</label>}
            <input className={styles[props.styles]} {...props.input}/>
        </div>
    )
}

export default Input;