"use client";
import { Alert, Backdrop, Box, Button, CircularProgress, Snackbar, Switch, TextField, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import styles from "./page.module.css";
import { api } from '@/utils/apiFile';
import { Delete, Save } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { handleClientRequest } from '@/utils/routeProtection';

const page = () => {
    const params = useParams();
    const router = useRouter();

    const user_id = params.user_id;
    handleClientRequest();

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: "",
            phoneNo: "",
            email: "",
            isAdmin: false
        }
    })

    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [isDisabled, setIsDisabled] = useState(false);
    const [loaderOpen, setLoaderOpen] = useState(false);

    useEffect(() => {
        api.get(`/user-details-list/${user_id}`).then((res) => {
            reset({
                fullName: res?.data?.full_name,
                phoneNo: res?.data?.phone_no,
                email: res?.data?.email,
                isAdmin: res?.data?.is_admin?.toLowerCase() === 'true'
            })
        })
            .catch((err) => {
                setAlertOpen(true);
                setMessage(err?.response?.data?.message);
                setSeverity("error");
            })
    }, [reset])

    const isValid = () => {
        if (phoneNo.length !== 10)
            return { "status": false, "errorMessage": "Invalid phone number" };

        if (!email.toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ))
            return { "status": false, "errorMessage": "Invalid email" }

        return { "status": true, "errorMessage": "" }
    }

    const onSubmit = (data) => {
        setLoaderOpen(true);
        setIsDisabled(true);
        api.put("/edit-user", {
            user_to_be_edited: user_id,
            edit_metadata: {
                full_name: data?.fullName,
                phone_no: data?.phoneNo,
                is_admin: data?.isAdmin,
                email: data?.email
            }
        })
            .then((res) => {
                setLoaderOpen(false);
                setAlertOpen(true);
                setMessage(res?.data?.message);
                setSeverity("success");
                setTimeout(() => router.back(), 3000);
            })
            .catch((err) => {
                setLoaderOpen(false);
                setIsDisabled(false);
                setAlertOpen(true);
                setMessage(err?.response?.data?.message);
                setSeverity("error");
            })
    }

    const handleDelete = () => {
        setLoaderOpen(true);
        setIsDisabled(true);
        api.delete("/delete-user", {
            data: {
                user_to_be_deleted: user_id
            }
        })
            .then((res) => {
                setLoaderOpen(false);
                setAlertOpen(true);
                setMessage(res?.data?.message);
                setSeverity("success");
                if (res?.data?.self_delete === "true") {
                    Cookies.remove("isLoggedIn");
                    setTimeout(() => router.push("/"), 3000)
                }
                else {
                    setTimeout(() => router.back(), 3000);
                }
            })
            .catch((err) => {
                setIsDisabled(false);
                setAlertOpen(true);
                setSeverity("error");
                setMessage(err?.response?.data?.message);
            })
    }

    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: 'primary.main', zIndex: theme.zIndex.drawer + 1 })}
                open={loaderOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
            <Box className={styles.main_container} sx={{ backgroundColor: "background", color: "textColor" }}>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box className={styles.header}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Edit User</Typography>
                        <Box className={styles.btn_container}>
                            <Button variant="contained" sx={{ backgroundColor: "error.main", fontWeight: "bold" }} onClick={handleDelete} disabled={isDisabled}>
                                <Delete />
                                Delete
                            </Button>

                            <Button type="submit" variant="contained" sx={{ backgroundColor: "primary.main", fontWeight: "bold" }} disabled={isDisabled}>
                                <Save />
                                Submit
                            </Button>
                        </Box>
                    </Box>

                    <Box className={styles.details_container} sx={{ backgroundColor: "secondaryBackground" }}>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Fullname</Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                size='small'
                                {...register("fullName", { required: "Full Name is required" })}
                                error={errors?.fullName}
                                helperText={errors?.fullName?.message}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Phone No.</Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                size='small'
                                {...register("phoneNo", { required: "Phone number is required", length: { value: 10, message: "Invalid phone number" } })}
                                error={errors?.phoneNo}
                                helperText={errors?.phoneNo?.message}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Email</Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                size='small'
                                {...register("email", { required: "Email is required", pattern: { value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: "Invalid email" } })}
                                error={errors?.email}
                                helperText={errors?.email?.message}
                            />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Is Admin?</Typography>
                            <Controller
                                name="isAdmin"
                                control={control}
                                render={({ field }) => (
                                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                )}
                            />
                        </Box>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default page