"use client";
import { Alert, Box, Button, Pagination, Paper, setRef, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import styles from "./page.module.css";
import { api } from '@/utils/apiFile';
import CustomDataGrid from '@/app/components/CustomDataGrid/CustomDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const page = () => {

    const router = useRouter();

    const [data, setData] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const columns = ["Username", "Full name", "Phone no.", "Email", "Admin User", "No. of times logged in", "Problems Solved", "Actions"];

    const fetchUsersList = () => {
        api.get("/user-details-list/").then((res) => {
            let temp = [];
            res?.data?.map((r, i) => {
                temp.push(createData(r?.user_metadata, r?.user_id))
            })
            setData(temp);
        })
            .catch((err) => {
                setAlertOpen(true);
                setSeverity("error");
                setMessage("Something went wrong!");
            })
    }

    const handleDelete = (user_id) => {
        api.delete("/delete-user", {
            data: {
                user_to_be_deleted: user_id
            }
        })
            .then((res) => {
                fetchUsersList();
                setAlertOpen(true);
                setMessage(res?.data?.message);
                setSeverity("success");
                if (res?.data?.self_delete === "true") {
                    Cookies.remove("isLoggedIn");
                    setTimeout(() => router.push("/"), 3000)
                }
            })
            .catch((err) => {
                setAlertOpen(true);
                setSeverity("error");
                setMessage(err?.response?.data?.message);
            })
    }

    const createData = ({ user_alias, full_name, phone_no, email, is_admin, user_login_count, problem_solved_count }, user_id) => {
        return {
            user_alias,
            full_name,
            phone_no,
            email,
            is_admin,
            user_login_count,
            problem_solved_count,
            actions: (
                <>
                    <Box className={styles.actions_container}>
                        <EditIcon sx={{ color: "primary.main", "&:hover": { cursor: "pointer" } }} onClick={() => router.push(`/home/admin/edit-user/${user_id}`)} />
                        <DeleteIcon sx={{ color: "error.main", "&:hover": { cursor: "pointer" } }} onClick={() => handleDelete(user_id)} />
                    </Box>
                </>
            )
        };
    }


    useEffect(() => {
        fetchUsersList();
    }, [])

    return (
        <>
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
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>All users</Typography>
                <CustomDataGrid data={data} columns={columns} />
            </Box >
        </>
    )
}

export default page