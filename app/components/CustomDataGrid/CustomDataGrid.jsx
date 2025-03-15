import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react';
import styles from "./CustomDataGrid.module.css";
import FilterListIcon from '@mui/icons-material/FilterList';

const CustomDataGrid = ({ data, columns, rowsPerPage = 5 }) => {
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const searchRef = useRef(null);

    const [column, setColumn] = useState("default");
    const [order, setOrder] = useState("ascending");

    useEffect(() => {
        setRows([...data]);
    }, [data])

    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const handleSearch = () => {
        let searchText = searchRef.current.value.toLowerCase();
        if (searchText !== "") {
            let results = data?.filter((r, i) => {
                for (let j of Object.keys(r)) {
                    if (r[j].toString().toLowerCase().includes(searchText)) {
                        return r;
                    }
                }
            })
            setRows(results);
            setPage(1);
        }
        else {
            setRows([...data]);
            setPage(1);
        }
    }

    const handleSort = () => {
        setOpen(false);
        if (column !== "default" || column !== "Action") {
            let x = columns.findIndex((y) => y === column);
            let key = Object.keys(rows[0])[x];

            let temp = rows;
            if (order === "ascending") {
                temp.sort((a, b) => {
                    return (a[key] < b[key] ? -1 : 1)
                })
            }
            else {
                temp.sort((a, b) => {
                    return (a[key] > b[key] ? -1 : 1)
                })
            }
            setRows(temp);
        }
    }

    const handleReset = () => {
        setColumn("default");
        setOrder("ascending");
        setRows(data);
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{ backgroundColor: "background", fontWeight: "bold" }}>Sort</DialogTitle>

                <DialogContent sx={{ width: "250px", backgroundColor: "background" }}>
                    <Box className={styles.selection_container}>
                        <Select size='small' select sx={{ width: "100%" }} value={column} onChange={(e) => setColumn(e.target.value)} inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'background'
                                    }
                                }
                            }
                        }}>
                            <MenuItem value={"default"}>Enter column name</MenuItem>
                            {columns?.map((r, i) => {
                                return (
                                    r !== "Action" ?
                                        <MenuItem key={i} value={r}>{r}</MenuItem>
                                        : null
                                )
                            })}
                        </Select>

                        <Select size='small' select sx={{ width: "100%" }} value={order} onChange={(e) => setOrder(e.target.value)} inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'background'
                                    }
                                }
                            }
                        }}>
                            <MenuItem value={"ascending"}>Ascending</MenuItem>
                            <MenuItem value={"descending"}>Descending</MenuItem>
                        </Select>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ backgroundColor: "background", padding: "10px 22px" }}>
                    <Button variant="contained" sx={{ backgroundColor: "error.main", fontWeight: "bold" }} onClick={handleReset}>Reset</Button>
                    <Button variant="contained" sx={{ backgroundColor: "primary.main", fontWeight: "bold" }} onClick={handleSort}>Apply</Button>
                </DialogActions>
            </Dialog>

            <Box className={styles.header}>
                <TextField type="search" size="small" id="outlined-basic" placeholder='Search' inputRef={searchRef} onKeyUp={(e) => {
                    if (e.key === "Enter")
                        handleSearch();
                }}></TextField>
                <Button variant="outlined" onClick={() => setOpen(true)}><FilterListIcon /></Button>
            </Box>

            <TableContainer component={Paper}>
                <Table size='small' aria-label="simple table">
                    <TableHead sx={{ backgroundColor: "primary.main" }}>
                        <TableRow>
                            {columns?.map((r, i) => {
                                return (
                                    <TableCell size="small" key={i} sx={{ color: "white", fontWeight: "bold", whiteSpace: "nowrap" }}>{r}</TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows?.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)?.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: i % 2 === 0 ? "background" : "secondaryBackground" }}
                            >
                                {Object.keys(row)?.map((x, j) => (
                                    <TableCell size="small" sx={{ whiteSpace: "nowrap" }} key={j}>{row[x]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box className={styles.pagination_container}>
                <Typography>{rows.length} {rows.length === 1 ? "result" : "results"}</Typography>
                <Pagination count={Math.ceil(rows.length / 5)} page={page} onChange={handlePageChange} color='primary' />

            </Box>
        </>
    )
}

export default CustomDataGrid