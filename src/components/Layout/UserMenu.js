import styles from "./UserMenu.module.css"
function UserMenu(props) {

    return (
        <button className={styles.button}>
            <span className={styles.icon}>
                <i className="bi bi-person-fill icon"></i>
            </span>
            <span className={styles['name-field']}>Hallo, Finn</span>
        </button>
    )
}

export default UserMenu;