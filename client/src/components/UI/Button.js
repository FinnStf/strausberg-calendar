import styles from './Button.module.css';

const Button = (props) => {
    return (
        <span className={styles['button-container']}>
    <button
        type={props.type || 'button'}
        className={`${styles.button} ${props.className} ${styles[props.className]}`}
        onClick={props.handleClick}
        disabled={props.disabled}
    >
      {props.children}
    </button>
        </span>
    );
};

export default Button;
