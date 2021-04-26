import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@material-ui/core";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "position", label: "Position", minWidth: 100 },
  //   {
  //     id: "population",
  //     label: "Population",
  //     minWidth: 170,
  //     align: "right",
  //     format: (value) => value.toLocaleString("en-US"),
  //   },
  //   {
  //     id: "size",
  //     label: "Size\u00a0(km\u00b2)",
  //     minWidth: 170,
  //     align: "right",
  //     format: (value) => value.toLocaleString("en-US"),
  //   },
  //   {
  //     id: "density",
  //     label: "Density",
  //     minWidth: 170,
  //     align: "right",
  //     format: (value) => value.toFixed(2),
  //   },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767),
// ];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);

  // DialogContent
  const [open, setOpen] = React.useState(false);
  const [handleChange, setHandleChange] = useState({
    email: "",
    name: "",
    position: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    console.log("EVENT:", name);
    setHandleChange({
      ...handleChange,
      [name]: value,
    });
  };

  //End Dialog Content

  useEffect(() => {
    axios
      .get("https://6086c09ba3b9c200173b6bdf.mockapi.io/hhm")
      .then((response) => {
        setRows(response.data);
        return;
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onFormSubmit = (e) => {
    console.log("Form Submit");
    // e.preventDefault();
    const { email, position, name } = handleChange;
    console.log("HandleChange:", handleChange);
    setRows((rows) => [
      ...rows,
      { id: Math.random(), name: name, email: email, position: position },
    ]);
    handleClose();
  };

  return (
    <>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <IconButton
          onClick={handleClickOpen}
          color="primary"
          aria-label="add to shopping cart"
        >
          <AddIcon />
        </IconButton>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      {/* DialogContent */}
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Details</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              id="name"
              label="Name"
              type="text"
              fullWidth
              onChange={changeHandler}
            />

            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="text"
              fullWidth
              onChange={changeHandler}
            />

            <TextField
              margin="dense"
              id="position"
              name="position"
              label="Position"
              type="text"
              fullWidth
              onChange={changeHandler}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onFormSubmit} type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </form>

      {/* End DialogContent */}
    </>
  );
}