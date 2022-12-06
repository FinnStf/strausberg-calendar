import styles from "./UserMenu.module.css"
import {Dropdown} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";

function UserMenu(props) {

    return (
        <Dropdown drop='end'>
            <Dropdown.Toggle className={styles.button}>
            <span className={styles.icon}>
                <i className="bi bi-person-fill icon"></i>
            </span>
                <span className={styles['name-field']}>Hallo, Finn</span>
            </Dropdown.Toggle>
            <DropdownMenu>
                <Dropdown.Item>Logout</Dropdown.Item>
            </DropdownMenu>
        </Dropdown>
    )
}

export default UserMenu;