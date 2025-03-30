"use client";
import React, { useContext, useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import styles from "./page.module.css";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Backdrop, Box, Button, Chip, CircularProgress, MenuItem, Select, Snackbar, Tab, TextField, Typography } from '@mui/material';
import { ModeContext } from '../../../CustomThemeProvider';
import BackupIcon from '@mui/icons-material/Backup';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { api } from '@/utils/apiFile';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const page = () => {

	const params = useParams();

	const problem_statement_id = params.problem_statement_id;

	const [code, setCode] = useState({});
	const codeRef = useRef(null);

	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [loaderOpen, setLoaderOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [language, setLanguage] = useState({});
	const [languageOptions, setLanguageOptions] = useState([]);
	const [enableSubmit, setEnableSubmit] = useState(false);

	const [problemStatementDetails, setProblemStatementDetails] = useState({});
	const [chipColor, setChipColor] = useState("success");

	const [value, setValue] = useState("1");

	const [isTestCasesTabDisabled, setIsTestCasesTabDisabled] = useState(true);
	const [testCaseDetails, setTestCaseDetails] = useState({})

	const handleChange = (value) => {
		codeRef.current.value = value;
	}

	const handleLanguageChange = (oldValue, newValue) => {
		let temp = { ...code };
		// storing code for the currently selected language before changing it
		temp[oldValue.language_name] = codeRef.current;

		codeRef.current = temp[newValue.language_name];
		setCode(temp);
		setLanguage(newValue);
	}

	const runCode = () => {
		setLoaderOpen(true);
		setValue("2");
		let data = {}
		if (Cookies.get("isLoggedIn")) {
			data = {
				code: codeRef.current,
				input: input,
				language_id: language?.language_id
			}
		}
		else {
			data = {
				code: codeRef.current,
				input: input,
				language_id: language?.language_id,
				guest_id: Cookies.get("guest_id")
			}
		}

		api.post(`/run-code`, data, {
			headers: {
				"Content-Type": "application/json"
			}
		}).then((res) => {
			setOutput(res?.data);
			setLoaderOpen(false);
		})
			.catch((err) => {
				setLoaderOpen(false);
				setOpen(true);
			})
	}

	const submitCode = () => {
		setLoaderOpen(true);
		setValue("3");
		setIsTestCasesTabDisabled(false);
		let data = {
			"language_id": language?.language_id,
			"code": codeRef.current,
			"problem_statement_id": problem_statement_id,
		}

		api.post(`/submit-code`, data).then((res) => {
			setLoaderOpen(false);
			setTestCaseDetails({
				testCases: res?.data?.test_cases,
				hiddenTestCases: res?.data?.hidden_test_cases_count,
				testCasesPassed: res?.data?.test_cases_passed,
				totalTestCases: res?.data?.total_test_cases
			})
		})
			.catch((err) => {
				setLoaderOpen(false);
				setOpen(true);
			})
	}

	const { mode, setMode } = useContext(ModeContext);

	useEffect(() => {
		if (Cookies.get("isLoggedIn"))
			setEnableSubmit(true);

		api.get(`/get-language-options`)
			.then((res) => {
				let temp = {};
				setLanguageOptions(res?.data);
				setLanguage(res?.data[0]);
				res?.data?.map((r, i) => {
					temp[r?.language_name] = "";
				})
				setCode(temp);
			})
			.catch((err) => {
				setOpen(true);
			})

		api.get(`/get-problem-list/${problem_statement_id}`).then((res) => {
			if (res?.data?.problem_statement_difficulty === "Easy")
				setChipColor("success")
			else if (res?.data?.problem_statement_difficulty === "Medium")
				setChipColor("warning")
			else if (res?.data?.problem_statement_difficulty === "Hard")
				setChipColor("error")

			setProblemStatementDetails({
				problemStatementTitle: res?.data?.problem_statement_title,
				problemStatementBody: res?.data?.problem_statement_body,
				problemStatementDifficulty: res?.data?.problem_statement_difficulty,
				problemStatementDuration: res?.data?.problem_statement_duration
			})
		})
			.catch((err) => {
				setOpen(true);
			});
	}, [])

	useEffect(() => {
		// when user is logged in and has not written any code for the selected language currently, fetch previously submitted code for the language (if any)

		if (Cookies.get("isLoggedIn") && language?.language_id !== undefined && code[language?.language_name] === "") {
			api.get(`/get-users-code/${language?.language_id}/${problem_statement_id}`).then((res) => {
				let temp = { ...code };
				temp[language.language_name] = res?.data?.code;
				codeRef.current = res?.data?.code;
				setCode(temp);
			})
				.catch((err) => {
					setOpen(true);
				})
		}
	}, [language])

	return (
		<>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
			>
				<Alert
					severity="error"
					variant="filled"
					sx={{ width: '100%' }}
				>
					Something went wrong!
				</Alert>
			</Snackbar>

			<Backdrop
				sx={(theme) => ({ color: 'primary.main', zIndex: theme.zIndex.drawer + 1 })}
				open={loaderOpen}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Box className={styles.main_container} sx={{ backgroundColor: "background", color: "textColor" }}>
				<Box className={styles.question_content_container}>
					<Box className={styles.question}>
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
								<TabList onChange={(e, newValue) => setValue(newValue)} variant='scrollable' scrollButtons={false}>
									<Tab label="Problem Statement" value="1" />
									<Tab label="Custom Input" value="2" />
									<Tab label="Test Cases" value="3" disabled={isTestCasesTabDisabled} />
								</TabList>
							</Box>

							<TabPanel value="1" sx={{ padding: "0px", display: "flex", flexDirection: "column", gap: "10px" }}>
								<Box>
									<Typography variant="h5" sx={{ fontWeight: "bold" }}>{problemStatementDetails?.problemStatementTitle}</Typography>

								</Box>

								<Box className={styles.problem_statement_metadata}>
									<Chip size="small" label={problemStatementDetails?.problemStatementDifficulty} color={chipColor} />
									<Typography>{`${problemStatementDetails?.problemStatementDuration || "0"} mins`}</Typography>
								</Box>

								<Box>
									<Typography sx={{ whiteSpace: "pre-wrap" }}>
										{problemStatementDetails?.problemStatementBody}
									</Typography>
								</Box>
							</TabPanel>

							<TabPanel value="2" sx={{ padding: "0px" }}>
								<Box className={styles.input_output_container}>
									<TextField
										sx={{
											'& .MuiInputBase-input': {
												fontFamily: "Fira Code, monospace"
											},
											flex: 1
										}}
										multiline
										placeholder='Input'
										value={input}
										onChange={(e) => setInput(e.target.value)}
										rows={5}
									></TextField>

									<TextField
										sx={{
											'& .MuiInputBase-input': {
												fontFamily: "Fira Code, monospace"
											},
											flex: 1
										}}
										multiline
										placeholder='Output'
										value={output}
										readOnly
										rows={5}
									></TextField>
								</Box>
							</TabPanel>

							<TabPanel value="3" sx={{ padding: "0px" }}>
								{testCaseDetails?.testCasesPassed !== undefined && (
									<>
										<Box className={styles.test_cases_container}>
											<Typography sx={{ fontSize: "24px", fontWeight: "bold", color: testCaseDetails.testCasesPassed === testCaseDetails.totalTestCases ? "success.main" : "error.main" }}>{testCaseDetails?.testCasesPassed + "/" + testCaseDetails?.totalTestCases + " test case(s) passed (" + testCaseDetails?.hiddenTestCases + " hidden)"} </Typography>

											<Box className={styles.accordion_container}>
												{testCaseDetails?.testCases?.map((r, i) => {
													return (
														<Accordion key={i}>
															<AccordionSummary sx={{ backgroundColor: r?.passed === true ? "success.main" : "error.main" }} expandIcon={<ExpandMoreIcon />}>
																{`Test Case ${i + 1}`}
															</AccordionSummary>

															<AccordionDetails>
																<Typography sx={{ fontWeight: "bold" }}>Input</Typography>
																<Typography sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{r?.input}</Typography>
																<Typography sx={{ fontWeight: "bold" }}>Output</Typography>
																<Typography sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{r?.output}</Typography>
																<Typography sx={{ fontWeight: "bold" }}>Expected Output</Typography>
																<Typography sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{r?.expected_output}</Typography>
															</AccordionDetails>
														</Accordion>
													)
												})}
											</Box>
										</Box>
									</>
								)}
							</TabPanel>
						</TabContext>

					</Box>

					<Box className={styles.content} sx={{ backgroundColor: "secondaryBackground" }}>
						<Box className={styles.toolbar}>
							<Box className={styles.language_select_btn_container}>
								<Select
									size="small"
									value={language}
									onChange={(e) => handleLanguageChange(language, e.target.value)}
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
									{languageOptions?.map((r, i) => {
										return (
											<MenuItem key={r?.language_id} value={r}>{r?.language_name}</MenuItem>
										)
									})}
								</Select>

								<Button variant="contained" sx={{ display: "flex", gap: "5px", fontWeight: "bold" }} onClick={runCode} title="Run">
									<PlayArrowIcon /> Run
								</Button>
								<Button variant="contained" sx={{ display: "flex", gap: "5px", fontWeight: "bold" }} color='success' disabled={!enableSubmit} title="Submit" onClick={submitCode}>
									<BackupIcon /> Submit
								</Button>
							</Box>
						</Box>
						<Box className={styles.editor}>
							<Editor
								language={language?.language_name?.toLowerCase()}
								theme={mode === "light" ? "vs-light" : "vs-dark"}
								value={code[language?.language_name]}
								onChange={handleChange}
								options={{
									fontFamily: "monospace",
									fontLigatures: "true",
									minimap: { enabled: false },
									fontSize: "14px"
								}}
							/>
						</Box>
					</Box>
				</Box>

			</Box >
		</>
	)
}

export default page