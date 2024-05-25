'use client';

import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {
    Paper,
    Grid,
    Button,
} from '@material-ui/core';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

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

export default withPageAuthRequired(function page(){
    const router = useRouter();
    const role = localStorage.getItem('role')
    const [movieAdded, setMovieAdded] = useState(false)

    useEffect(() => {
        if(role != 'Admin') {
            router.push(`${REDIRECT_URL}/404`)
        }
    },[])

    const onSubmit = async (values: any, form: any) => {
        if (values.movieTitle && values.description && values.cast && values.director && values.poster && values.language && values.duration && values.price) {
            const moviePayload = {
                title: values.movieTitle,
                genre: values.genre,
                actor: values.cast,
                director: values.director,
                language: values.language,
                duration: values.duration,
                description: values.description,
                price: values.price,
                poster: values.poster,
                is_deleted: 0
            }
            const { data } = await axios.put(BACKEND_API_URL + 'movies/',
                {
                    ...moviePayload
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setMovieAdded(true)

            form.reset({})
        } else {

        }
    };


    return (
        <>
            {role=='Admin' && <main className='p-3 h-100'>
                {movieAdded && <Alert severity="success" onClose={() => {setMovieAdded(false)}}>This is a success alert — check it out!</Alert>}
                <div className='text-white text-center mb-2' style={{ fontSize: '30px' }}>Add a Movie</div>
                <Form
                    onSubmit={onSubmit}
                    initialValues={{ employed: true, stooge: 'larry' }}
                    render={({ handleSubmit, submitting, pristine, values }) => (
                        <form onSubmit={handleSubmit} noValidate>
                            <Paper style={{ padding: 20 }} className='m-5'>
                                <Grid container alignItems="flex-start" spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            name="movieTitle"
                                            type="text"
                                            label="Movie Title"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            name="description"
                                            type="text"
                                            label="Description"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="cast"
                                            fullWidth
                                            required
                                            type="text"
                                            label="Cast"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="genre"
                                            fullWidth
                                            required
                                            type="text"
                                            label="Genre"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="director"
                                            fullWidth
                                            required
                                            type="text"
                                            label="Director"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="poster"
                                            fullWidth
                                            required
                                            type="text"
                                            label="Poster URL"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="language"
                                            fullWidth
                                            required
                                            type="text"
                                            label="Language"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="duration"
                                            fullWidth
                                            required
                                            type="number"
                                            label="Duration"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            name="price"
                                            fullWidth
                                            required
                                            type="number"
                                            label="Price"
                                        />
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
                                </Grid>
                            </Paper>
                        </form>
                    )}
                />
            </main>}
        </>
    );
});