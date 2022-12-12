import styles from './Header.module.css'
import {useContext} from "react";
import logoName from "../../assets/logoName.png"
import AccountMenu from "./AccountMenu";
import authContext from "../../store/auth-context";

function Header(props) {
    const authCtx = useContext(authContext)
    return (
        <>
            {authCtx.isLoggedIn && <header className={styles.header}>
                <img className={styles.logo} src={logoName} alt='strausberghütten logo'/>
                <AccountMenu/>
            </header>}
        </>
    )
}

export default Header