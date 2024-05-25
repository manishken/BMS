'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'
import {Carousel, CarouselItem, Col, Container, Row} from "react-bootstrap";
import CircleProgress from "@/components/CircleProgress";
import ShowingCard from "@/components/ShowingCard";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TheatreMap from "@/components/TheatreMap";
import { teal } from '@mui/material/colors';

export interface theatreInfo {
    searchParams: {
        theatreId: string,
    }
}

interface ChosenTheatre {
    created_at: string,
    id: number,
    theatre_address: string,
    theatre_city: string,
    theatre_country: string,
    theatre_name: string,
    theatre_state: string,
    updated_at: string,
    theatre_postal_code: number,
    theatre_latitude: number,
    theatre_longitude: number
}

export interface TheatreProps {
    id: number,
    address: string,
    city: string,
    country: string,
    name: string,
    state: string,
    postal: number,
    latitude: number,
    longitude: number
}

let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}

export default function Page({searchParams}: theatreInfo) {
    const [movies, setMovies] = useState(Array);
    const [theatre, setTheatre] = useState<TheatreProps>();

    const getSearchesDetails = async () => {
        const getTheatreResponse = await fetch(BACKEND_API_URL + 'theatres/' + searchParams?.theatreId);
        const data: ChosenTheatre = await getTheatreResponse.json();
        const theatrePayload: TheatreProps = {
            id: data.id,
            address: data.theatre_address,
            city: data.theatre_city,
            country: data.theatre_country,
            name: data.theatre_name,
            state: data.theatre_state,
            postal: data.theatre_postal_code,
            latitude: data.theatre_latitude,
            longitude: data.theatre_longitude
        }
        setTheatre(theatrePayload);
        
        const response = await fetch(BACKEND_API_URL + 'get_movie_showings_by_theatre_id?theatre_id=' + searchParams?.theatreId)
        let responseJson = await response.json()
        setMovies(responseJson);
    }

    useEffect(() => {
        getSearchesDetails(); 
    }, [])
    return (
        <>
            <main>
                <div className="container-fluid p-0">
                    <div className="row-fluid p-0 text-light">
                        <div className="row-fluid p-0">
                            <div className="border-0">
                                <Container className="m-auto mt-5 mb-5 p-0 rounded bg-dark bg-opacity-75">
                                    <Row className="gx-1">
                                        <Row className="bg-darker rounded p-5 popcorn">
                                            <h2 className="mb-4">{theatre?.name}</h2>
                                            <h5>{theatre?.address}</h5>
                                            <h5>{theatre?.city}, {theatre?.state} {theatre?.postal}</h5>
                                            <h5> </h5>
                                            <div className="border-0">
                                                {theatre?.latitude ? <TheatreMap latitude={theatre?.latitude} longitude={theatre?.longitude}></TheatreMap> : null}
                                            </div>
                                            <SearchBar floating={false} blackText={true} field='showings' suggestions={["Bloomington", "Chicago"]}>{searchParams['theatreId']}</SearchBar>
                                            <Col className="col-12">
                                                {/* * * * * *
                                                  *  Movie  *
                                                  * * * * * */}
                                                <div className='row justify-content-center mx-5 mt-5'>
                                                    <h2 className='text-light mx-auto text-center'>Movies</h2>
                                                    <hr className='mt-3 mb-4 text-white w-75 mx-auto'/>
                                                    <Row>
                                                        {
                                                            movies?.map((data, index) => {
                                                                return (
                                                                    <MovieCard movieId={data.id} title={data.title} imgSrc={data.poster}>
                                                                        {data.description}
                                                                    </MovieCard>
                                                                )
                                                            })
                                                        }
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
