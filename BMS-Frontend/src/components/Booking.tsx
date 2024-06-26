

import { useEffect, useState } from 'react';
import Seats, { SeatsDetails } from './Seats';
import MovieCalendar from './MovieCalender';
import BookingUserInfo from './BookingUserInfo';
import { MovieDetailsProps } from '@/app/booking/[bookingId]/page';
import { MiniLoader } from './MiniLoader';
import { useRouter } from 'next/navigation';
import axios from "axios"
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

interface BookingDataType {
    email: String | null | undefined
    mobile: String | null | undefined
    date: String | null | undefined
    seats: Array<Number> | undefined
    movieTime: String | null | undefined
}

interface ShowDetails {
    showId: number
    screenId: number
    startTime: string
    endTime: string
    screenName: string
    totalSeats: string
}

interface ShowDetailsApiResponse {
    showing_id: number,
    total_seats: string,
    screen_name: string,
    start_time: string,
    end_time: string,
    screen_id: number
}

interface SelectedScreen {
    startDate: string
    showId: number
}

export interface FormError {
    email?: boolean
    mobile?: boolean
    seats?: boolean
}

let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}

const Booking = (movieDetailsPaload: MovieDetailsProps) => {
    const router = useRouter();

    const [BookingData, setBookingData] = useState<BookingDataType | null | undefined>(null);

    const [showDetails, setShowDetails] = useState<ShowDetails[]>([])
    const [timings, setTimings] = useState<SelectedScreen[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [allTheatres, setAllTheatres] = useState<any>([])
    const [selectTheatre, setSelectedTheatre] = useState<number>()
    const [error, setError] = useState<FormError>({ email: false, mobile: false, seats: false })

    const [selectedtime, setSelectedTime] = useState<SelectedScreen | null>(null);
    const showDetailsApi = BACKEND_API_URL + 'showings_by_movie/';
    const bookTicketsAPI = BACKEND_API_URL + 'add_booking_details/';
    const role = localStorage.getItem('role')

    const bookingDetailsCallback = ({ email, date, mobile, seats }: BookingDataType) => {
        const newEmail: String | null | undefined = email ? email : BookingData?.email
        const newMobile: String | null | undefined = mobile ? mobile : BookingData?.mobile
        const newDate: String | null | undefined = date ? date : BookingData?.date
        const newSeats: Array<Number> | undefined = seats ? seats : BookingData?.seats
        setBookingData({ email: newEmail, mobile: newMobile, date: newDate, seats: newSeats, movieTime: selectedtime?.startDate })
        if (newEmail) {
            setError((prev) => ({ mobile: prev.mobile, email: false, seats: prev.seats }))
        }
        if (newMobile) {
            setError((prev) => ({ mobile: false, email: prev.email, seats: prev.seats }))
        }
        if (newSeats && newSeats.length > 0) {
            setError((prev) => ({ mobile: prev.mobile, email: prev.email, seats: false }))
        }
    }

    const bookTickets = async (seatsInformaton: SeatsDetails) => {
        const requestPayload = {
            email: BookingData?.email,
            mobile: BookingData?.mobile,
            booked_seats: BookingData?.seats,
            show_id: seatsInformaton.showId,
            movie_id: seatsInformaton.movieId,
            theatre_id: seatsInformaton.theatreId,
            screen_id: seatsInformaton.screenId,
            booked_date: (new Date()).toISOString().replace('T', ' ').split('.')[0]
        }

        if (requestPayload.email && requestPayload.mobile && requestPayload?.booked_seats && requestPayload?.booked_seats?.length > 0) {
            const response = await fetch(bookTicketsAPI, { method: 'put', body: JSON.stringify(requestPayload) })
            const data: any = await response.json();
            if (data && role != 'Employee') {
                payment({ movieName: movieDetailsPaload.movieName, quantity: requestPayload.booked_seats.length, price: 10, bookingId: data.booking_id, email: requestPayload.email })
                // navigate(data.booking_id, requestPayload.email)
            } else if (role == 'Employee') {
                navigate(data.booking_id, requestPayload.email)
            }
        } else {
            if (!requestPayload?.booked_seats || requestPayload?.booked_seats?.length == 0) {
                setError((prev) => ({ mobile: prev.mobile, email: prev.email, seats: true }))
            }
            if (!requestPayload.email && !requestPayload.mobile) {
                setError((prev) => ({ mobile: true, email: true, seats: prev.seats }))
            } else if (!requestPayload.mobile) {
                setError((prev) => ({ mobile: true, email: prev.email, seats: prev.seats }))
            } else {
                setError((prev) => ({ mobile: prev.mobile, email: true, seats: prev.seats }))
            }
        }
    }

    const getShowDetails = async (id: number) => {
        const chosenDate = BookingData?.date ? BookingData?.date.split('T')[0] : (new Date()).toISOString().split('T')[0];
        const response = await fetch(showDetailsApi + id + '/?date=' + chosenDate + '&thId=' + selectTheatre, { method: 'get' })
        const data: ShowDetailsApiResponse[] = await response.json();
        data.forEach(element => {
            const showDetailsPaload: ShowDetails = {
                showId: element.showing_id,
                screenId: element.screen_id,
                startTime: element.start_time,
                endTime: element.end_time,
                totalSeats: element.total_seats,
                screenName: element.screen_name
            };
            setShowDetails((prev) => [...prev, showDetailsPaload]);
            setTimings((prev) => [...prev, { startDate: showDetailsPaload.startTime, showId: showDetailsPaload.showId }]);
            setSelectedTime({ startDate: data[0].start_time, showId: data[0].showing_id })
        });
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }

    const getAllTheatres = async() => {
        const chosenDate = BookingData?.date ? BookingData?.date.split('T')[0] : (new Date()).toISOString().split('T')[0];
        const { data } = await axios.get(`${BACKEND_API_URL}get_all_theatres_for_a_movie?id=${movieDetailsPaload.id}&date=${chosenDate}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        setAllTheatres(data)
        setSelectedTheatre(data[0]?.id)
    }

    useEffect(() => {
        getAllTheatres();
    }, [BookingData?.date])

    useEffect(() => {
        if (BookingData?.date) {
            setLoading(true)
            setShowDetails([]);
            setTimings([]);
            setSelectedTime(null)
            getShowDetails(movieDetailsPaload.id)
        }
    }, [movieDetailsPaload.id, BookingData?.date, selectTheatre])

    const navigate = (bookingId: number, email: String) => {
        router.push(`/confirm-booking?bookingId=${bookingId}&email=${email}`)
    }

    const payment = async (paymentData: any) => {
        // e.prevesntDefault();
        const { data } = await axios.post('/api/payment',
            {
                paymentData
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        window?.location.assign(data)
    }

    const selectThreate = (e) => {
        setSelectedTheatre(e.target.value)
    }


    return (
        <section>
            <div className='row justify-content-lg-between'>
                <div className='col-md-12 col-sm-12 bg-none'>
                    {/* <div className='pt-4 pb-4 pr-3 pl-3 mt-2 mb-1 row justify-content-between ml-0 mr-0 bg-white rounded'> */}
                    <div className='pt-4 pb-4 mt-2 mb-1 d-flex flex-wrap bg-white rounded'>
                        <div className='col-md-4 col-sm-12'>
                            <div className='movie-title text-sm' style={{ marginLeft: '20px' }}>{movieDetailsPaload.movieName} - {movieDetailsPaload.language} </div>
                            <div className='ml-3' style={{ marginLeft: '20px' }}>Genre - {movieDetailsPaload.genre}</div>
                        </div>
                        <div className='col-md-3 col-sm-12 mx-5'>
                            {selectTheatre && <FormControl variant='standard' fullWidth>
                                <InputLabel id="demo-simple-select-label">Theatre</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectTheatre}
                                    defaultValue={selectTheatre}
                                    label="Theatre"
                                    onChange={selectThreate}
                                >
                                    {allTheatres.length > 0 && allTheatres.map((theatre:any) => {
                                        return(<MenuItem value={theatre.id}>{theatre.theatre_name}, {theatre.theatre_city}</MenuItem>)
                                    })}

                                </Select>
                            </FormControl>}
                        </div>

                        <div className='col-md-4 col-sm-1 align-self-center justify-items-end'>
                            {!loading && <><div className='mb-3'>Timings</div>
                                <div className='row w-100'>
                                    {timings && timings.map((data, index) => { return <div key={index} className={selectedtime?.startDate != data.startDate ? 'time-box col-md-4 col-sm-4 ml-1 time-box-in-active w-25' : ' time-box col-md-4 col-sm-4 ml-1 w-25'} onClick={() => setSelectedTime({ startDate: data.startDate, showId: data.showId })}>{data.startDate}</div> })}
                                </div></>}
                            {loading && <MiniLoader />}
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-sm-12 pr-0'><MovieCalendar bookingDetailsCallback={bookingDetailsCallback} /></div>
                <div className='col-md-8 col-sm-12 pl-1'>
                    <BookingUserInfo bookingDetailsCallback={bookingDetailsCallback} error={error} />
                    {selectedtime?.showId && <Seats bookingDetailsCallback={bookingDetailsCallback} loading={loading} showId={selectedtime?.showId} showDate={selectedtime?.startDate} bookTickets={bookTickets} error={error} />}
                </div>
            </div>
        </section>
    )
}

export default Booking;