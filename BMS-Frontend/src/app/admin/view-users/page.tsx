'use client';

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Box, Grid, Modal, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { Form, Field } from 'react-final-form';
import { useRouter } from 'next/navigation';
import {
    Button,
} from '@material-ui/core';


let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}
let REDIRECT_URL = ''

if(process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    REDIRECT_URL =  'https://bms-6.netlify.app'
} else {
    REDIRECT_URL = 'http://localhost:3000'
}

export default withPageAuthRequired(function page() {
    const router = useRouter();
    const role = localStorage.getItem('role')
    const [users, setUsers] = useState([]);
    const [possibleRoles, setPossibleRoles] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>()
    const handleOpen = (data: any) => {
        if (data.role == 'Admin') {
            setPossibleRoles(['Employee', 'User'])
        }

        if (data.role == 'Employee') {
            setPossibleRoles(['Admin', 'User'])
        }

        if (data.role == 'User') {
            setPossibleRoles(['Admin', 'Employee'])
        }
        setSelectedData(data)
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const getAllUsers = async () => {
        const { data } = await axios.get(BACKEND_API_URL + `allUsers/`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        setUsers(data)
    }

    const onSubmit = async (values: any, form: any) => {
        if (values.role) {
            const user = {
                role: values.role,
                id: selectedData?.id
            }
            const { data } = await axios.post(BACKEND_API_URL + `update_user_role/`,
                {
                    ...user
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            handleClose()
            getAllUsers()
        }
    };

    //     name: string,
    //     email: number,
    //     mobile: number,
    //     role: number,
    // ) {
    //     return { name, email, mobile, role };
    // }

    // // const rows = [
    // //     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    // //     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    // //     createData('Eclair', 262, 16.0, 24, 6.0),
    // //     createData('Cupcake', 305, 3.7, 67, 4.3),
    // //     createData('Gingerbread', 356, 16.0, 49, 3.9),
    // //   ];

    useEffect(() => {
        if(role != 'Admin') {
            router.push(`${REDIRECT_URL}/404`)
        }
    },[])


    useEffect(() => {
        getAllUsers()
    }, [])



    return (
        <>
            {role == 'Admin' && <main className='p-3 w-100 d-flex justify-content-center align-items-center'>
                <div className='bg-white p-5 w-100'>
                    <div className='text-lg mb-5 text-center' style={{ fontSize: '30px' }}>Users List</div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell >Email</TableCell>
                                    <TableCell >Mobile</TableCell>
                                    <TableCell >role</TableCell>
                                    <TableCell >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((row: any) => (
                                    <TableRow
                                        key={row?.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell >{row.email}</TableCell>
                                        <TableCell >{row.mobile}</TableCell>
                                        <TableCell >{row.role}</TableCell>
                                        <TableCell ><button className='btn btn-primary' onClick={() => handleOpen(row)} disabled={row.role == 'Admin'}>Change Role</button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Change Role
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className='w-100 d-flex justify-content-center'>
                                <Form
                                    onSubmit={onSubmit}
                                    initialValues={{}}
                                    // validate={validate}
                                    render={({ handleSubmit, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit} noValidate className='w-75'>
                                            <Paper style={{ padding: 30 }} className='m-5'>
                                                <Grid item xs={12}>
                                                    <div className='d-flex shows-select'>
                                                        <Field name="role" component="select" style={{ width: '100%', border: '1px solid black', padding: 10 }}>
                                                            <option />
                                                            {possibleRoles?.length > 0 && possibleRoles.map((role: any) => { return (<option value={role}>{role}</option>) })}
                                                        </Field>
                                                    </div>
                                                </Grid>
                                                <Grid item style={{ marginTop: 16 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit"
                                                        disabled={submitting}
                                                    >
                                                        Submit
                                                    </Button>
                                                </Grid>
                                            </Paper>
                                        </form>
                                    )}
                                />
                            </div>
                        </Typography>
                    </Box>
                </Modal>
            </main>}
        </>
    );
});