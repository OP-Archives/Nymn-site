import React, { useEffect } from "react";
import { Box, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import SimpleBar from "simplebar-react";
import Loading from "../utils/Loading";

const limit = 50;

export default function ViewSubmissions(props) {
  const [submissions, setSubmissions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(null);
  const [total, setTotal] = React.useState(null);

  useEffect(() => {
    document.title = `Event Submissions - Nymn`;
    const fetchSubmissions = async () => {
      await fetch(`https://api.nymn.gg/submissions?$limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setPage(1);
          setSubmissions(response.data);
          setTotal(response.total);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchSubmissions();
    return;
  }, []);

  const handlePageChange = (_, value) => {
    if (page === value) return;
    setLoading(true);
    setPage(value);

    fetch(`https://api.nymn.gg/submissions?$limit=${limit}&$skip=${(value - 1) * limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.data.length === 0) return;
        setSubmissions(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading) return <Loading />;

  const totalPages = Math.ceil(total / limit);

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <TableContainer component={Paper} sx={{ width: "900px", mt: 1 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Link</TableCell>
                <TableCell align="right">Drive Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission, i) => (
                <TableRow key={submission.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {submission.user.display_name}
                  </TableCell>
                  <TableCell align="right">{submission.link}</TableCell>
                  <TableCell align="right">{submission.driveId ? `https://drive.google.com/u/2/open?id=${submission.driveId}` : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        {totalPages !== null && <Pagination count={totalPages} disabled={totalPages <= 1} color="primary" page={page} onChange={handlePageChange} />}
      </Box>
    </SimpleBar>
  );
}
