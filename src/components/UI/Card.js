import styles from './Card.module.css'
function Card(props){
    return(
        <div className={`${styles.card}`}>
            <div className={`${styles[props.className]} ${styles['card-content']}`}>{props.children}</div>
        </div>
    )
}
export default Card;