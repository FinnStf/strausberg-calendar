import styles from "./UserMenu.module.css"
import ReactTooltip from "react-tooltip";
function UserMenu(props) {

    return (
        <button className={styles.button}>
            <span className={styles.icon}>
                <i className="bi bi-person-circle icon"></i>
            </span>
            <span>Hallo, Finn</span>
        </button>
    )
}

export default UserMenu;