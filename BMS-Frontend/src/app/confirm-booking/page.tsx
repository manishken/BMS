'use client';

import React, { useEffect, useState } from 'react';
import ViewTicket from '@/components/ViewTicket';
import { useSearchParams } from 'next/navigation'

export interface ConfirmBookingProps {
    bookingId: number,
    email: string | null
}
export const dynamic = 'force-dynamic';

let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}

export default function Page() {
    const searchParams_query = useSearchParams()
    console.log(searchParams_query)
    const searchParams: ConfirmBookingProps = {
        bookingId: Number(searchParams_query.get('bookingId')),
        email: searchParams_query.get('email')
    }

    const searchAllAPI = BACKEND_API_URL + 'search_all';

	const handleSearch = async ( event ) => {
	    const term = event.target.value;
		console.log(term);
		const response = await fetch(searchAllAPI + '/?searchTerm=' + term, {method: 'get'});
		let data = await response.json();
		console.log(data);
        data.forEach((element:any) => {
            let searchAllPayload = {
                showId: element.showing_id,
                screenId: element.screen_id,
                startTime: element.start_time,
                endTime: element.end_time,
                totalSeats: element.total_seats,
                screenName: element.screen_name
            };
        });
	}

    return (
        <>
        <main className='p-3 h-100'>
            <ViewTicket {...searchParams}/>
        </main>
        </>
    );
}
