import { Avatar, Grid, Box, Paper } from '@mui/material';
import logo from "../assets/logoShort.png"
import background1 from "../assets/strausberg-01.jpg"
import background2 from "../assets/strausberg-02.jpg"
import background3 from "../assets/strausberg-03.jpg"
import background4 from "../assets/strausberg-04.jpg"
import background5 from "../assets/strausberg-05.jpg"
import {useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';

export default function Login() {
    const [backgroundImage, setBackgroundImage] = useState(background1)

    useEffect(() => {
        setBackgroundImage(getRandomImage())
    }, [])

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
        <Grid container sx={{ height: '100vh' }}>
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
                    transition: 'background-image 0.5s ease-in-out'
                }}
            />
            <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6}>
                <Box
                    sx={{
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent:'center',
                        height:'100%'
                    }}
                >
                    <Avatar sx={{
                        m: 1,
                        height: 150, width: 150
                    }} src={logo}>
                    </Avatar>
                   
                    <Outlet/>
                </Box>
            </Grid>
        </Grid>
    );
}
