'use client';

import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import {
    Paper,
    Grid,
    Button,
} from '@material-ui/core';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { LocalizationProvider, MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

export default withPageAuthRequired(function page() {
    const router = useRouter();
    const role = localStorage.getItem('role')
    const [movieAdded, setMovieAdded] = useState(false);
    const [movieDate, setMovieDate] = useState(dayjs())
    const [startTime, setStartTime] = useState(dayjs())
    const [endTime, setEndTime] = useState(dayjs())
    const [movies, setMovies] = useState<any>([])
    const [theatres, setTheatres] = useState<any>([])
    const [screens, setScreens] = useState<any>([])
    const [timeError, setTimeError] = useState<boolean>(false)

    useEffect(() => {
        if(role != 'Admin') {
            router.push(`${REDIRECT_URL}/404`)
        }
    },[])


    const onSubmit = async (values: any, form: any) => {
        if (values.movieId && values.theatreId && values.screenId && movieDate && startTime && endTime) {
            const screenPayload = {
                movie_id: Number(values?.movieId),
                theatre_id: Number(values?.theatreId),
                screen_id: Number(values?.screenId),
                start_time: dayjs(startTime.toDate()).format('hh:mm A'),
                end_time: dayjs(endTime.toDate()).format('hh:mm A'),
                date: dayjs(movieDate.toDate()).format('YYYY-MM-DD')
            }
            if (screenPayload.start_time == screenPayload.end_time) {
                setTimeError(true)
                return
            } else {
                setTimeError(false)
            }
            const { data } = await axios.post(BACKEND_API_URL + 'showings/',
                {
                    ...screenPayload
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setMovieAdded(true)

            form.reset({})
        }
    };

    const getShowImformation = async () => {
        const { data } = await axios.get(BACKEND_API_URL + 'getShowInformation/',
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        setMovies(data?.movies)
        setTheatres(data?.theatres)
    }

    const handleDateSelect = (date: any) => {
        setMovieDate(date)
        // bookingDetailsCallback({date: dayjs(date?.$d, {utc: true}).format('yyyy-mm-dd')})
    }

    const handleStartTimeSelect = (time: any) => {
        setStartTime(time)
        // bookingDetailsCallback({date: dayjs(date?.$d, {utc: true}).format('yyyy-mm-dd')})
    }

    const handleEndTimeSelect = (time: any) => {
        setEndTime(time)
        // bookingDetailsCallback({date: dayjs(date?.$d, {utc: true}).format('yyyy-mm-dd')})
    }

    const getScreens = async (threatreId: number) => {
        if (threatreId) {
            const { data } = await axios.get(BACKEND_API_URL + `getScreensByTheatreId/${threatreId}/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setScreens(data)
        }
    }

    useEffect(() => {
        getShowImformation()
    }, [])

    setTimeout(setTimeError, 10000);
    setTimeout(setMovieAdded, 10000);


    return (
        <>
            {role=='Admin' && <main className='p-3 h-100'>
                {movieAdded && <Alert severity="success" onClose={() => { setMovieAdded(false) }}>Show created</Alert>}
                <div className='text-white text-center mb-2' style={{ fontSize: '30px' }}>Create different shows for a movie</div>
                {theatres.length > 0 && movies.length > 0 && <div className='d-flex w-100 justify-content-center'>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{}}
                        // validate={validate}
                        render={({ handleSubmit, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate className='w-75'>
                                <Paper style={{ padding: 30 }} className='m-5'>
                                    <Grid container alignItems="flex-start" spacing={2}>
                                        <Grid item xs={12} className='my-2'>
                                            <div className='d-flex shows-select'>
                                                <label className='w-25'>Movie*</label>
                                                <Field name="movieId" component="select" style={{ width: '75%', border: '1px solid black', padding: 10 }}>
                                                    <option />
                                                    {movies.length > 0 && movies.map((movie: any) => { return (<option value={movie?.id}>{movie?.title}</option>) })}
                                                </Field>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className='d-flex shows-select'>
                                                <label className='w-25'>Theatre*</label>
                                                <Field name="theatreId" component="select" style={{ width: '75%', border: '1px solid black', padding: 10 }}>
                                                    <option />
                                                    {theatres.length > 0 && theatres.map((theatre: any) => { return (<option value={theatre?.id}>{theatre?.theatre_name}</option>) })}
                                                </Field>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className='d-flex shows-select'>
                                                <label className='w-25'>Screen*</label>
                                                <Field name="screenId" component="select" style={{ width: '75%', border: '1px solid black', padding: 10 }} onClick={() => getScreens(values.theatreId)}>
                                                    <option />
                                                    {screens?.length > 0 && screens.map((screen: any) => { return (<option value={screen?.id}>{screen?.screen_name}</option>) })}
                                                </Field>
                                            </div>
                                        </Grid>
                                        <div className='d-flex w-100 align-items-center'>
                                            <div className='w-25'>
                                                <label className='text-left mx-2 w-100'>Show date*</label>
                                            </div>
                                            <div className='w-50'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer
                                                        children
                                                        components={[
                                                            'MobileDatePicker',
                                                        ]}
                                                    ></DemoContainer>
                                                    <DemoItem>
                                                        <MobileDatePicker className='rounded' defaultValue={dayjs(new Date())} disablePast onChange={handleDateSelect} slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }} />
                                                    </DemoItem>
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className='d-flex w-100 align-items-center'>
                                            <div className='w-25'>
                                                <label className='text-left mx-2 w-100'>Show start time*</label>
                                            </div>
                                            <div className='w-50'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer
                                                        children
                                                        components={[
                                                            'MobileTimePicker',
                                                        ]}
                                                    ></DemoContainer>
                                                    <DemoItem>
                                                        <MobileTimePicker onChange={handleStartTimeSelect} value={startTime} />
                                                    </DemoItem>
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className='d-flex w-100 align-items-center'>
                                            <div className='w-25'>
                                                <label className='text-left mx-2 w-100'>Show end time*</label>
                                            </div>
                                            <div className='w-50'>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer
                                                        children
                                                        components={[
                                                            'DatePicker',
                                                        ]}
                                                    ></DemoContainer>
                                                    <DemoItem>
                                                        <MobileTimePicker onChange={handleEndTimeSelect} value={endTime} />
                                                    </DemoItem>
                                                </LocalizationProvider>
                                            </div>
                                        </div>
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
                </div>}
                {timeError && <Alert severity="error" className='ease-in-out' onClose={() => { setTimeError(false) }}>Start time and End Time cannot be same</Alert>}
            </main>}
        </>
    );
});