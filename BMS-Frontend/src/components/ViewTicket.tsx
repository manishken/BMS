import { ConfirmBookingProps } from '@/app/confirm-booking/page';
import { useEffect, useState } from 'react';
import { QRCode } from '@progress/kendo-react-barcodes';



interface TicketApiResponse {
    seats_booked: number,
    booked_date: string,
    title: string,
    genre: string,
    language: string,
    duration: string,
    t_name: string,
    t_address: string,
    t_city: string,
    t_state: string,
    t_country: string,
    screen_name: string
}

interface TicketDetals {
    seatsBooked: number,
    bookedDate: string,
    title: string,
    genre: string,
    language: string,
    duration: string,
    tName: string,
    tAddress: string,
    tCity: string,
    tState: string,
    tCountry: string,
    screenName: string
}

let BACKEND_API_URL = ''

if(process.env.NEXT_PUBLIC_BACKEND_API_URL) {
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



const ViewTicket = ({ bookingId, email }: ConfirmBookingProps) => {
    const [ticket, setTicket] = useState<TicketDetals | null>(null);
    const tickeUrl = BACKEND_API_URL+'get_ticket_by_booking_id/';


    const getTicketDetails = async (id: number, email: string | null) => {
        if (id && email) {
            console.log("entering")
            const response = await fetch(tickeUrl + id + '/?email=' + email, { method: 'get' })
            const data: TicketApiResponse = await response.json();
            console.log(data)
            const ticket: TicketDetals = {
                seatsBooked: data?.seats_booked,
                bookedDate: data?.booked_date?.split('T')[0],
                title: data?.title,
                genre: data?.genre,
                language: data?.language,
                duration: data?.duration,
                tName: data?.t_name,
                tAddress: data?.t_address,
                tCity: data?.t_city,
                tState: data?.t_state,
                tCountry: data?.t_country,
                screenName: data?.screen_name
            }
            setTicket(ticket)
            console.log("initiating email")
            try {
                await fetch('api/email', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({id: bookingId, email: email}),
                })
                  .then((res) => res.json())
                  .then(() => console.log('sent'));
              } catch (error) {
                console.error(error);
              }
        }
    }

    useEffect(() => {
        console.log(bookingId, email)
        getTicketDetails(bookingId, email)
    }, [])

    return (
        <section className='h-100 d-flex align-items-center'>
            {ticket && <div className='w-100 h-50'>
                <div className='mx-5 ticket-box text-white rounded row'>
                    <div className='px-5 py-3 col-md-9'>
                        <div className='text-center mb-4' style={{ fontSize: '30px' }}>Ticket</div>
                        <div className='row' style={{ fontSize: '16px' }}>
                            <div className='col-md-6'>
                                <div className='mb-1'>
                                    Movie Name - {ticket?.title}
                                </div>
                                <div className='mb-1'>
                                    Genre - {ticket?.genre}
                                </div>
                                <div className='mb-1'>
                                    Language - {ticket?.language}
                                </div>
                                <div className='mb-1'>
                                    Tickets Booked - {ticket?.seatsBooked}
                                </div>
                                <div className='mb-1'>
                                    Booked Date - {ticket?.bookedDate}
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='mb-1'>
                                    Theatre Name - {ticket?.tName}
                                </div>
                                <div className='mb-1'>
                                    Theatre Address - {ticket?.tAddress}, {ticket?.tCity}
                                </div>
                                <div className='mb-1'>
                                    State - {ticket?.tState}
                                </div>
                                <div className='mb-1'>
                                    Country - {ticket?.tCountry}
                                </div>
                                <div className='mb-1'>
                                    Screen - {ticket?.screenName}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 d-flex flex-column align-items-center justify-content-center border-left-qr'> 
                        <QRCode value={`${REDIRECT_URL}/confirm-booking?bookingId=${bookingId}&email=${email}`} />
                        <div className='mb-1 mt-4'>
                            Email - {email}
                        </div>
                    </div>
                </div>
            </div>}
        </section>
    )
}

export default ViewTicket;