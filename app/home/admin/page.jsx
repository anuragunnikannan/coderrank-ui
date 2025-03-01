import { Box, Typography } from '@mui/material'
import React from 'react'
import styles from "./page.module.css";
import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import { handleClientRequest } from '@/utils/routeProtection';

const page = () => {
    handleClientRequest();
    return (
        <>
            <Box className={styles.main_container} sx={{ backgroundColor: "background", color: "textColor" }}>
                <Typography variant="h5" fontWeight="bold">Admin Dashboard</Typography>

                <Box className={styles.menu_container}>
                    <Link href='/home/admin/all-users' className={styles.links}>
                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <PeopleIcon sx={{ fontSize: "64px" }}></PeopleIcon>
                            <Typography fontWeight="bold">Manage Users</Typography>
                        </Box>
                    </Link>

                    <Link href='/home/admin/all-problems' className={styles.links}>
                        <Box className={styles.card} sx={{ backgroundColor: "secondaryBackground" }}>
                            <QuizIcon sx={{ fontSize: "64px" }}></QuizIcon>
                            <Typography fontWeight="bold">Add/Edit Problems</Typography>
                        </Box>
                    </Link>
                </Box>
            </Box>
        </>
    )
}

export default page