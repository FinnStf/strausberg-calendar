import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from "../assets/logoShort.png"
import background1 from "../assets/strausberg-01.jpg"
import background2 from "../assets/strausberg-02.jpg"
import background3 from "../assets/strausberg-03.jpg"
import background4 from "../assets/strausberg-04.jpg"
import background5 from "../assets/strausberg-05.jpg"
import {useContext, useEffect, useState} from "react";
import authContext from "../store/auth-context";
import {useNavigate} from "react-router-dom"
import {firebaseApp} from '../firebase.js';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import EmployeeContext from "../store/employee-context";
import {CssBaseline, Paper} from "@mui/material";


export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [pwdError, setPwdError] = useState(null)
    const [backgroundImage, setBackgroundImage] = useState(background1)
    const authCtx = useContext(authContext)
    const employeeCtx = useContext(EmployeeContext)
    const auth = getAuth(firebaseApp)
    const navigate = useNavigate()

    useEffect(()=>{
        setBackgroundImage(getRandomImage())
    }, [])
    const errorHandler = (errorCode) => {
        setPwdError(null)
        setEmailError(null)
        if (errorCode === 'auth/invalid-email' || errorCode === 'auth/user-not-found') {
            setEmailError('Fehler beim Login: ' + errorCode)
        } else {
            setPwdError('Fehler beim Login: ' + errorCode)
        }
    }
    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setIsLoading(true)
        if (isLogin) {
            await signIn(data.get('email'), data.get('password'))
        } else {
            await createUser(data.get('email'), data.get('password'), data.get('surname'), data.get('lastname'))
        }
        setIsLoading(false)
    }

    async function signIn(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                authCtx.login(user.accessToken, new Date(Date.now() + 1000000))
                employeeCtx.setLoggedInEmployee(user.reloadUserInfo.localId)
                navigate('/')
            })
            .catch((error) => {
                errorHandler(error.code)
            });
    }

    async function createUser(email, password, surname, lastname) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(auth.currentUser, {
                    displayName: `${surname} ${lastname}`
                }).then(() => {
                    const user = userCredential.user;
                    employeeCtx.addEmployee(user.reloadUserInfo.localId, surname, lastname)
                    authCtx.login(user.accessToken, new Date(Date.now() + 1000000))
                    employeeCtx.setLoggedInEmployee(user.reloadUserInfo.localId)
                    setIsLoading(false)
                    navigate('/')
                }).catch((error) => {
                    errorHandler(error.code)
                });
            })
            .catch((error) => {
                errorHandler(error.code)
            });
    }

    const getRandomImage = () => {
        const number = Math.floor(Math.random() * 4) + 1
        if (number === 1) {
            return background1
        } else if (number === 2) {
            return background2
        } else if (number === 3) {
            return background3
        } else if (number === 4) {
            return background4
        } else if (number === 5) {
            return background5
        }
    }

    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <CssBaseline/>
            <Grid
                item
                xs={false}
                sm={4}
                md={8}
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        height: 100, width: 100
                    }} src={logo}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {isLogin ? 'Sign in' : 'Create new Account'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            {!isLogin &&
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="surname"
                                    label="Vorname"
                                    name="surname"
                                    autoFocus
                                />
                            </Grid>
                            }
                            {!isLogin &&
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    name="lastname"
                                    label="Nachname"
                                    id="lastname"
                                />
                            </Grid>
                            }
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Adresse"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={emailError ? true : false}
                                    helperText={emailError ? emailError : ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    error={pwdError ? true : false}
                                    helperText={pwdError ? pwdError : ""}
                                />
                            </Grid>
                        </Grid>
                        <LoadingButton
                            loading={isLoading}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            {isLogin ? 'Login' : 'Create Account'}
                        </LoadingButton>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component='button' underline='none' onClick={switchAuthModeHandler}
                                      variant="body2">
                                    {isLogin ? 'Create new account' : 'Login with existing account'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
