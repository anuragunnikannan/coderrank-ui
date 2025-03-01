"use client";
import CustomDataGrid from '@/app/components/CustomDataGrid/CustomDataGrid'
import { Alert, Box, Button, Chip, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from "./page.module.css";
import { api } from '@/utils/apiFile';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import { Add } from '@mui/icons-material';
import { handleClientRequest } from '@/utils/routeProtection';

const page = () => {

    const router = useRouter();
    const [data, setData] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    handleClientRequest();

    const columns = ["Title", "Tags", "Difficulty", "Action"]

    const createData = ({ problem_statement_uuid, problem_statement_title, problem_statement_tags, problem_statement_difficulty }) => {
        return {
            problem_statement_title,
            problem_statement_tags,
            problem_statement_difficulty,
            actions: (
                <>
                    <Button variant="contained" onClick={() => router.push(`/home/admin/edit-problem/${problem_statement_uuid}`)}>
                        <EditIcon />
                    </Button>
                </>
            )
        }
    }

    useEffect(() => {
        api.get("/get-problem-list/").then((res) => {
            let temp = [];
            res?.data?.map((r, i) => {
                temp.push(createData(r));
            })
            setData(temp);
        })
            .catch((err) => {
                setAlertOpen(true);
                setSeverity("error");
                setMessage(err?.response?.data?.message);
            })
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
                <Box className={styles.header}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>All problems</Typography>
                    <Button variant="contained" sx={{ fontWeight: "bold" }} onClick={() => router.push("/home/admin/add-problem")}><Add /> Add</Button>
                </Box>
                <CustomDataGrid data={data} columns={columns} />
            </Box >
        </>
    )
}

export default page