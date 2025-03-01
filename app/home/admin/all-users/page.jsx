"use client";
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from "./page.module.css";
import { api } from '@/utils/apiFile';
import CustomDataGrid from '@/app/components/CustomDataGrid/CustomDataGrid';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { handleClientRequest } from '@/utils/routeProtection';

const page = () => {

    const router = useRouter();

    const [data, setData] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    handleClientRequest();

    const columns = ["Username", "Full name", "Phone no.", "Email", "Admin User", "No. of times logged in", "Problems Solved", "Actions"];

    const fetchUsersList = () => {
        api.get("/user-details-list/").then((res) => {
            let temp = [];
            res?.data?.map((r, i) => {
                temp.push(createData(r));
            })
            setData(temp);
        })
            .catch((err) => {
                setAlertOpen(true);
                setSeverity("error");
                setMessage("Something went wrong!");
            })
    }

    const createData = ({ user_id, user_alias, full_name, phone_no, email, is_admin, user_login_count, problem_solved_count }) => {
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
                    <Button variant="contained" onClick={() => router.push(`/home/admin/edit-user/${user_id}`)}>
                        <EditIcon />
                    </Button>
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