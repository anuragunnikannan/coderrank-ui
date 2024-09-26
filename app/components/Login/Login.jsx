import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useRef } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { api } from '@/utils/apiFile';
import { useRouter } from 'next/navigation';
import styles from "./Login.module.css";

const Login = ({ setIsLogin, setIsError, setOpen, setMessage }) => {
    const formRef = useRef();

    const router = useRouter();

    function onLoginClick() {
        const formData = formRef.current;
        let reqBody = {
            "user_alias": formData.elements["user_alias"].value,
            "password": formData.elements["password"].value
        }

        api.post("/login-user", reqBody, {
            withCredentials: true
        }).then((res) => {
            let date = new Date();
            date.setMonth(date.getMonth() + 1);
            document.cookie = `isLoggedIn=true; expires=${date}`;
            router.push("/home/code");
        })
            .catch((err) => {
                setMessage(err?.response?.data?.message);
                setIsError(true);
                setOpen(true);
            })
    }

    return (
        <Box className={styles.loginContainer}>
            <Typography variant="h5" className={styles.heading}>Login</Typography>
            <form className={styles.form} ref={formRef}>
                <TextField size="small" placeholder="Username" name="user_alias" sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        '& fieldset': {
                            borderRadius: '6px',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        borderRadius: '6px',
                        color: "white",
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                }} />

                <TextField size="small" type="password" placeholder="Password" name="password" sx={{

                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        '& fieldset': {
                            borderRadius: '6px',
                        },
                    },
                    '& .MuiOutlinedInput-input': {
                        borderRadius: '6px',
                        color: "white",
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                }} />
                <Button variant="contained" color="success" onClick={onLoginClick}>Login</Button>
            </form>

            <Typography>Or login with</Typography>
            <Box className={styles.socialButtons}>
                <Button className={styles.googleButton}><GoogleIcon /></Button>
                <Button className={styles.facebookButton}><FacebookIcon /></Button>
                <Button className={styles.githubButton}><GitHubIcon /></Button>
            </Box>

            <Typography className={styles.signUpText}>
                Don’t have an account? <a className={styles.signUpLink} onClick={(e) => { setIsLogin(false) }}>Sign Up</a>
            </Typography>
        </Box>

    )
}

export default Login