import styles from "./UserMenu.module.css"
function UserMenu(props) {

    return (
        <button className={styles.button}>
            <span className={styles.icon}>
                <i className="bi bi-person-circle icon"></i>
            </span>
            <span>Finn Steffan</span>
        </button>
    )
}

export default UserMenu;