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
import {redirect} from "react-router-dom"


export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const authCtx = useContext(authContext)

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        //TODO : add validation for login form
        setIsLoading(true)
        let url;
        if (isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD4RV1Jr4pIwDsfLRjqhHu96N0nLxDxACg'
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD4RV1Jr4pIwDsfLRjqhHu96N0nLxDxACg'
        }
        fetch(url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: data.get('email'),
                    password: data.get('password'),
                    returnSecureToken: true
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
            setIsLoading(false)
            if (res.ok) {
                return res.json()
            } else {
                return res.json().then(data => {
                    let errorMsg = 'Signup failed'
                    if (data && data.error && data.error.message) {
                        errorMsg = data.error.message;
                    }
                    throw new Error(errorMsg)
                });
            }
        }).then(data => {
            const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000))
            authCtx.login(data.idToken, expirationTime.toISOString())
            if (!isLogin){
                const surname = data.get("surname")
                const lastname = data.get("lastname")
            }else{

            }
            return redirect("/")
        }).catch((error) => {
            alert(error.message)
        })
    };

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
