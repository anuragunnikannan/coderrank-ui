"use client";
import { Alert, Backdrop, Box, Button, CircularProgress, MenuItem, Select, Snackbar, Switch, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import styles from "./page.module.css";
import { Add, Delete, Info, Save } from "@mui/icons-material";
import { api } from "@/utils/apiFile";
import { useParams, useRouter } from "next/navigation";

const page = () => {

    const params = useParams();
    const router = useRouter();
    const problemStatementId = params.problem_statement_id;

    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");
    const [loaderOpen, setLoaderOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            body: "",
            duration: 0,
            tags: "",
            difficulty: "Easy",
            testCases: [
                { testCaseId: "", input: "", expectedOutput: "", testCaseWeightage: 1, isHidden: false },
            ]
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "testCases",
    });

    useEffect(() => {
        api.get(`/get-problem-details/${problemStatementId}`).then((res) => {
            reset({
                title: res?.data?.problem_statement_title,
                body: res?.data?.problem_statement_body,
                duration: res?.data?.problem_statement_duration,
                tags: res?.data?.problem_statement_tags,
                difficulty: res?.data?.problem_statement_difficulty,
                testCases: res?.data?.test_cases?.map((r, i) => {
                    return {
                        testCaseId: r?.test_case_id,
                        input: r?.input,
                        expectedOutput: r?.expected_output,
                        testCaseWeightage: r?.test_case_weightage,
                        isHidden: r?.is_hidden
                    }
                })
            })
        })
    }, [])

    const onSubmit = (data) => {
        setLoaderOpen(true);
        setIsDisabled(true);
        let reqBody = {
            "problem_to_be_edited": problemStatementId,
            "edit_metadata": {
                "problem_statement_title": data.title,
                "problem_statement_body": data.body,
                "problem_statement_duration": data.duration,
                "problem_statement_difficulty": data.difficulty,
                "problem_statement_tags": data.tags,
                "test_cases": data.testCases.map((r, i) => {
                    return {
                        "test_case_id": r.testCaseId,
                        "input": r.input,
                        "expected_output": r.expectedOutput,
                        "test_case_weightage": r.testCaseWeightage,
                        "is_hidden": r.isHidden
                    }
                })
            }
        }

        api.put("/edit-problem", reqBody).then((res) => {
            setAlertOpen(true);
            setMessage("Problem statement edited successfully");
            setSeverity("success");
            setLoaderOpen(false);
            setTimeout(() => router.back(), 3000);
        })
            .catch((err) => {
                setAlertOpen(true);
                setMessage(err?.response?.data?.message || "Something went wrong");
                setSeverity("error");
                setLoaderOpen(false);
            })
    };

    const handleDelete = () => {
        setLoaderOpen(true);
        setIsDisabled(true);
        api.delete("/delete-problem", {
            data: {
                "requested_problem_id": problemStatementId
            }
        })
            .then((res) => {
                setAlertOpen(true);
                setMessage("Problem statement deleted successfully");
                setSeverity("success");
                setLoaderOpen(false);
                setTimeout(() => router.back(), 3000);
            })
            .catch((err) => {
                setAlertOpen(true);
                setMessage(err?.response?.data?.message || "Something went wrong");
                setSeverity("error");
                setLoaderOpen(false);
                setIsDisabled(false);
            })
    }

    const handleDeleteTestCase = (testCaseId, index) => {
        api.delete("/delete-test-case", {
            data: {
                "test_case_id": testCaseId
            }
        }).then((res) => {
            setAlertOpen(true);
            setMessage("Problem statement edited successfully");
            setSeverity("success");
            remove(index);
        })
            .catch((err) => {
                setAlertOpen(true);
                setMessage(err?.response?.data?.message || "Something went wrong");
                setSeverity("error");
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

                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box className={styles.header}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Edit Problem Statement</Typography>

                        <Box className={styles.btn_container}>
                            <Button sx={{ fontWeight: "bold", backgroundColor: "error.main" }} variant="contained" disabled={isDisabled} onClick={handleDelete}>
                                <Delete />
                                Delete
                            </Button>
                            <Button type="submit" sx={{ fontWeight: "bold" }} variant="contained" disabled={isDisabled}>
                                <Save />
                                Save
                            </Button>
                        </Box>
                    </Box>

                    <Box className={styles.form_container} sx={{ backgroundColor: "secondaryBackground" }}>
                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Title</Typography>
                            <TextField
                                sx={{ width: "100%" }}
                                size="small"
                                {...register("title", { required: "Title is required" })}
                                error={errors?.title}
                                helperText={errors?.title?.message}
                            />
                        </Box>

                        <Box>
                            <Typography sx={{ fontWeight: "bold" }}>Body</Typography>
                            <TextField
                                sx={{ width: "100%", whiteSpace: "pre-wrap" }}
                                size="small"
                                multiline
                                {...register("body", { required: "Body is required" })}
                                error={errors?.body}
                                helperText={errors?.body?.message}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: "10px" }}>
                            <Box sx={{ width: "50%" }}>
                                <Typography sx={{ fontWeight: "bold" }}>Difficulty</Typography>
                                <Select
                                    sx={{ width: "100%" }}
                                    size="small"
                                    defaultValue="Easy"
                                    {...register("difficulty")}
                                    onChange={(e) => setValue("difficulty", e.target.value)}
                                    inputProps={{
                                        MenuProps: {
                                            MenuListProps: {
                                                sx: {
                                                    backgroundColor: 'background'
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="Easy">Easy</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Hard">Hard</MenuItem>
                                </Select>
                            </Box>

                            <Box sx={{ width: "50%" }}>
                                <Typography sx={{ fontWeight: "bold" }}>Duration</Typography>
                                <TextField
                                    sx={{ width: "100%" }}
                                    size="small"
                                    type="number"
                                    error={errors?.duration}
                                    helperText={errors?.duration?.message}
                                    {...register("duration", {
                                        valueAsNumber: true,
                                        required: "Duration is required",
                                        min: {
                                            value: 0,
                                            message: "Negative value not allowed"
                                        }
                                    })}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                                <Typography sx={{ fontWeight: "bold" }}>Tags</Typography>
                                <Tooltip title="Type tags separated by commas without any spaces. For eg. Arrays,Queue,Recursion" placement="right" arrow>
                                    <Info />
                                </Tooltip>
                            </Box>
                            <TextField
                                sx={{ width: "100%" }}
                                size="small"
                                error={errors?.tags}
                                helperText={errors?.tags?.message}
                                {...register("tags", { required: "Tags are required" })}
                            />
                        </Box>

                        {fields.map((field, index) => (
                            < React.Fragment key={field.id} >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography sx={{ fontWeight: "bold" }} variant="h6">Test Case {index + 1}</Typography>
                                    <Button onClick={() => handleDeleteTestCase(field.testCaseId, index)} variant="contained" color="error" disabled={fields.length === 1}>
                                        <Delete />
                                    </Button>
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: "bold" }}>Input</Typography>
                                    <TextField
                                        sx={{ width: "100%" }}
                                        multiline
                                        size="small"
                                        error={errors?.testCases?.[index]?.input}
                                        helperText={errors?.testCases?.[index]?.input?.message}
                                        {...register(`testCases.${index}.input`, { required: "Input is required" })}
                                    />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: "bold" }}>Expected Output</Typography>
                                    <TextField
                                        sx={{ width: "100%" }}
                                        size="small"
                                        multiline
                                        error={errors?.testCases?.[index]?.expectedOutput}
                                        helperText={errors?.testCases?.[index]?.expectedOutput?.message}
                                        {...register(`testCases.${index}.expectedOutput`, {
                                            required: "Expected output is required",
                                        })}
                                    />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: "bold" }}>Weightage</Typography>
                                    <TextField
                                        sx={{ width: "100%" }}
                                        size="small"
                                        type="number"
                                        error={errors?.testCases?.[index]?.testCaseWeightage}
                                        helperText={errors?.testCases?.[index]?.testCaseWeightage?.message}
                                        {...register(`testCases.${index}.testCaseWeightage`, {
                                            valueAsNumber: true,
                                            required: "Weightage is required",
                                            min: {
                                                value: 1,
                                                message: "Must be greater than or equal to 0"
                                            }
                                        })}
                                    />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: "bold" }}>Hide Test Case?</Typography>
                                    <Switch
                                        {...register(`testCases.${index}.isHidden`)}
                                        defaultChecked={field.isHidden}
                                    />
                                </Box>
                            </React.Fragment>
                        ))}

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button
                                onClick={() =>
                                    append({
                                        testCaseId: "",
                                        input: "",
                                        expectedOutput: "",
                                        testCaseWeightage: 1,
                                        isHidden: false,
                                    })
                                }
                                sx={{ fontWeight: "bold" }}
                                variant="contained"
                            >
                                <Add /> Add Test Case
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box >
        </>
    );
};

export default page;
