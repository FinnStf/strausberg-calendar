import styles from './Header.module.css'
import {Fragment} from "react";
import logoName from "../../assets/logoName.png"
import AccountMenu from "./AccountMenu";

function Header(props) {
    return (
        <Fragment>
            <header className={styles.header}>
                    <img className={styles.logo} src={logoName} alt='strausberghütten logo'/>
                    <AccountMenu/>
            </header>
        </Fragment>
    )
}

export default Header