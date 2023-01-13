import styles from './Header.module.css'
import {useContext} from "react";
import logoName from "../../assets/logoName.png"
import AccountMenu from "./AccountMenu";
import authContext from "../../store/auth-context";
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";

function Header(props) {
    const authCtx = useContext(authContext)
    const navigate = useNavigate()

    return (
        <Box sx={{ flexGrow: 1 }}>
            {authCtx.isLoggedIn && <header className={styles.header}>
                <img onClick={()=>{navigate('/')}} className={styles.logo} src={logoName} alt='strausberghütten logo'/>
                <AccountMenu/>
            </header>}
        </Box>
    )
}

export default Header