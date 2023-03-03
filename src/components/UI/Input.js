import styles from './Input.module.css'

function Input(props) {
    return (
        <div className={`${styles.inputbox} ${styles[props.styles]}`}>
            {props.label && <span>{props.label}</span>}
            <input onChange={props.onChange} {...props.input}/>
        </div>
    )
}

export default Input;