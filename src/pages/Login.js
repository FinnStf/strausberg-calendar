import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from "../assets/logoShort.png"
import {useContext, useState} from "react";
import authContext from "../store/auth-context";
import {useNavigate} from "react-router-dom"
import firebaseApp from '../firebase.js';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";


export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [pwdError, setPwdError] = useState(null)
    const authCtx = useContext(authContext)
    const auth = getAuth(firebaseApp)
    const navigate = useNavigate()

    const errorHandler = (errorCode)=>{
        setPwdError(null)
        setEmailError(null)
        if(errorCode==='auth/invalid-email'||errorCode==='auth/user-not-found'){
            setEmailError('Fehler beim Login: '+errorCode)
        }else{
            setPwdError('Fehler beim Login: '+errorCode)
        }
    }
    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    async function handleSubmit(event){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setIsLoading(true)
        if (isLogin){
            await signIn(data.get('email'), data.get('password'))
        }else{
            await createUser(data.get('email'), data.get('password'), data.get('surname'), data.get('lastname'))
        }
        setIsLoading(false)
    }

    async function signIn(email, password){
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                authCtx.login(user.accessToken, new Date(Date.now()+1000000))
                navigate('/')
            })
            .catch((error) => {
                errorHandler(error.code)
            });
    }

    async function createUser(email, password, surname, lastname){
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(auth.currentUser, {
                    displayName: `${surname} ${lastname}`
                }).then(() => {
                    const user = userCredential.user;
                    authCtx.login(user.accessToken, new Date(Date.now()+1000000))
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

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
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
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                    {!isLogin && <Grid container>
                        <Grid item xs>
                            <TextField
                                sx={{mr:1}}
                                margin="normal"
                                required
                                id="surname"
                                label="Vorname"
                                name="surname"
                                autoFocus
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                margin="normal"
                                required
                                name="lastname"
                                label="Nachname"
                                id="lastname"
                            />
                        </Grid>
                    </Grid>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Adresse"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        error={emailError?true:false}
                        helperText={emailError?emailError:""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={pwdError?true:false}
                        helperText={pwdError?pwdError:""}
                    />
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
                            <Link component='button' underline='none' onClick={switchAuthModeHandler} variant="body2">
                                {isLogin ? 'Create new account' : 'Login with existing account'}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
