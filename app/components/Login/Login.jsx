import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useContext, useRef } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { api } from '@/utils/apiFile';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./Login.module.css";
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = ({ setIsLogin, setIsError, setOpen, setMessage }) => {
    const formRef = useRef();

    const router = useRouter();
    const searchParams = useSearchParams();

    const onLoginClick = () => {
        const formData = formRef.current;
        let reqBody = {
            "user_alias": formData.elements["user_alias"].value,
            "password": formData.elements["password"].value
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login-user`, reqBody, {
            withCredentials: true
        }).then((res) => {
            Cookies.set("accessToken", res?.data?.access_token, { expires: 1 / 48 });
            Cookies.set("isLoggedIn", "true", { expires: 1 / 48 });

            const redirectUrl = searchParams.get("redirect_url")
            if (res?.data?.admin_user) {
                if (redirectUrl)
                    router.push(redirectUrl);
                else
                    router.push("/home/admin")
            }
            else {
                if (redirectUrl)
                    router.push(redirectUrl);
                else
                    router.push("/home");
            }
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
            <form className={styles.form} ref={formRef} onKeyUp={(e) => {
                if (e.key === "Enter")
                    onLoginClick();
            }
            }>
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
