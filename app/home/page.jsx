"use client";
import React, { useEffect, useState } from 'react';
import styles from "./page.module.css";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Typography } from '@mui/material';
import { api } from '@/utils/apiFile';
import CodeIcon from '@mui/icons-material/Code';
import Cookies from 'js-cookie';
import { FilterAlt } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const page = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const [difficulty, setDifficulty] = useState("");
    const [status, setStatus] = useState("");

    const getColor = (difficulty) => {
        let color = "success";
        if (difficulty === "Easy")
            color = "success.main";
        else if (difficulty === "Medium")
            color = "warning.main";
        else if (difficulty === "Hard")
            color = "error.main"

        return color;
    }

    const filterProblems = (value, category) => {
        let tempFilterCriteria = { ...filterCriteria };
        tempFilterCriteria[category] = value;

        let result = problems;
        for (let i of Object.keys(tempFilterCriteria)) {
            result = result?.filter((r, j) => {
                if (r[i] === tempFilterCriteria[i]) {
                    return r;
                }
            })
        }

        setFilterCriteria(tempFilterCriteria);
        setFilteredProblems(result);
    }

    const handleReset = () => {
        setFilteredProblems([...problems]);
        setDifficulty("");
        setStatus("");
    }

    useEffect(() => {
        if (Cookies.get("isLoggedIn"))
            setIsLoggedIn(true);

        api.get("/get-problem-list/").then((res) => {
            let temp = [];
            setProblems(res?.data);
            setFilteredProblems(res?.data);
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

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{ backgroundColor: "background", fontWeight: "bold" }}>Filter</DialogTitle>
                <DialogContent sx={{ backgroundColor: "background" }}>
                    <Box className={styles.filter_container_dialog}>
                        <Box>
                            <FormControl>
                                <FormLabel id="difficulty">Difficulty</FormLabel>
                                <RadioGroup
                                    name="difficulty"
                                    value={difficulty}
                                    onChange={(e) => {
                                        setDifficulty(e.target.value);
                                        filterProblems(e.target.value, "problem_statement_difficulty")
                                    }}
                                >
                                    <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                    <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                    <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                </RadioGroup>
                            </FormControl>
                        </Box>



                        {isLoggedIn ? <>
                            <Divider />
                            <Box>
                                <FormControl>
                                    <FormLabel id="status">Status</FormLabel>
                                    <RadioGroup
                                        name="status"
                                        value={status}
                                        onChange={(e) => {
                                            setStatus(e.target.value);
                                            filterProblems(e.target.value, "problem_statement_status")
                                        }}
                                    >
                                        <FormControlLabel value="solved" control={<Radio />} label="Solved" />
                                        <FormControlLabel value="unsolved" control={<Radio />} label="Unsolved" />
                                    </RadioGroup>
                                </FormControl>

                            </Box>
                        </>
                            : null}
                    </Box>

                    <DialogActions>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ fontWeight: "bold", backgroundColor: "error.main", width: "100px" }}
                            onClick={() => {
                                handleReset();
                                setOpen(false);
                            }}>
                            Reset
                        </Button>

                        <Button
                            size="small"
                            variant="contained"
                            sx={{ fontWeight: "bold", width: "100px" }}
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Box className={styles.main_container} sx={{ backgroundColor: "background", color: "textColor" }}>
                <Box className={styles.filter_btn_container}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>Problems</Typography>
                    <Box className={styles.filter_btn}>
                        <Button onClick={() => setOpen(true)} variant="contained" sx={{ fontWeight: "bold" }} endIcon={<FilterAlt />}>Filter</Button>
                    </Box>
                </Box>

                <Box className={styles.problems_container}>
                    <Box className={styles.filter_container}>
                        <Box>
                            <FormControl>
                                <FormLabel id="difficulty">Difficulty</FormLabel>
                                <RadioGroup
                                    name="difficulty"
                                    value={difficulty}
                                    onChange={(e) => {
                                        setDifficulty(e.target.value);
                                        filterProblems(e.target.value, "problem_statement_difficulty")
                                    }}
                                >
                                    <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                                    <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                                    <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                                </RadioGroup>
                            </FormControl>
                        </Box>



                        {isLoggedIn ? <>
                            <Divider />
                            <Box>
                                <FormControl>
                                    <FormLabel id="status">Status</FormLabel>
                                    <RadioGroup
                                        name="status"
                                        value={status}
                                        onChange={(e) => {
                                            setStatus(e.target.value);
                                            filterProblems(e.target.value, "problem_statement_status")
                                        }}
                                    >
                                        <FormControlLabel value="solved" control={<Radio />} label="Solved" />
                                        <FormControlLabel value="unsolved" control={<Radio />} label="Unsolved" />
                                    </RadioGroup>
                                </FormControl>

                            </Box>
                        </>
                            : null}

                        <Button size="small" variant="contained" sx={{ fontWeight: "bold", backgroundColor: "error.main", width: "100px" }} onClick={handleReset}>Reset</Button>
                    </Box>

                    <Box className={styles.cards_container}>
                        {filteredProblems.length === 0 ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Typography>No problems found</Typography>
                                </Box>
                            </>
                        )
                            : filteredProblems?.map((r, i) => {
                                return (
                                    <>
                                        <Box sx={{ backgroundColor: "secondaryBackground", padding: "20px", borderRadius: "10px" }}>
                                            <Box className={styles.card_item_container}>
                                                <Box className={styles.card_item_left}>
                                                    <Typography variant="h6" sx={{ fontWeight: "900" }}>{r?.problem_statement_title}</Typography>
                                                    <Typography sx={{ fontWeight: "bold", color: getColor(r?.problem_statement_difficulty) }}>{r?.problem_statement_difficulty}</Typography>
                                                    <Typography sx={{ fontSize: "14px" }}>Tags: {r?.problem_statement_tags}</Typography>
                                                </Box>

                                                <Box>
                                                    <Button sx={{ fontWeight: "bold", width: "100px" }} variant={r?.problem_statement_status === "solved" ? "outlined" : "contained"} endIcon={<CodeIcon />} onClick={() => router.push(`/home/code/${r?.problem_statement_uuid}`)}>{r?.problem_statement_status === "solved" ? "Solved" : "Solve"}</Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                )
                            })}
                    </Box>
                </Box>

            </Box>
        </>
    )
}

export default page