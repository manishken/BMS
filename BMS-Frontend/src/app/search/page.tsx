'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'
import {Carousel, CarouselItem, Col, Container, Row} from "react-bootstrap";
import CircleProgress from "@/components/CircleProgress";
import ShowingCard from "@/components/ShowingCard";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TheatreCard from "@/components/TheatreCard";

export interface searchBar {
    searchParams: {
        showingsSearchBar: string,
        locationSearchBar: string,
        priceStartSearchBar: number,
        priceEndSearchBar: number,
        dateStartSearchBar: string,
        dateEndSearchBar: string
    }
}

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

export default function Page({searchParams}: searchBar) {
    const [movies, setMovies] = useState(Array);
    const [theaters, setTheaters] = useState(Array);    

    const getSearchesDetails = async () => {
        const response = await fetch(
            `${BACKEND_API_URL}search_all?searchTerm=` + searchParams?.showingsSearchBar
            + '&' + 'searchLocation=' + searchParams?.locationSearchBar
            + '&' + 'searchPriceStart=' + searchParams?.priceStartSearchBar
            + '&' + 'searchPriceEnd=' + searchParams?.priceEndSearchBar
            + '&' + 'searchDateStart=' + searchParams?.dateStartSearchBar
            + '&' + 'searchDateEnd=' + searchParams?.dateEndSearchBar)
        let responseJson = await response.json()
        setMovies(responseJson.movie_matches);
        setTheaters(responseJson.theater_matches);
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
                                            <h2 className="mb-4">Search Results</h2>
                                            <form id='showingsSearchForm' className="container-fluid" action='/search' method='get'>
                                            <Row className='m-auto'>
                                                <Col className='col-6 col-md-3'>
                                                    <div className="input-group mb-3">
                                                        <span className="input-group-text">$</span>
                                                        <input type="number" min='0' className="form-control" form='showingsSearchForm' name='priceStartSearchBar' defaultValue={searchParams?.priceStartSearchBar}/>
                                                        <span className="input-group-text"> to </span>
                                                        <input type="number" min='0' className="form-control" form='showingsSearchForm' name='priceEndSearchBar' defaultValue={searchParams?.priceEndSearchBar}/>
                                                    </div>
                                                </Col>
                                                <Col className='col-12 col-md-6'>
                                                    <div className="input-group mb-3">
                                                        <input type="datetime-local" className="form-control" form='showingsSearchForm' name='dateStartSearchBar' defaultValue={searchParams?.dateStartSearchBar}/>
                                                        <span className="input-group-text"> to </span>
                                                        <input type="datetime-local" className="form-control" form='showingsSearchForm' name='dateEndSearchBar' defaultValue={searchParams?.dateEndSearchBar}/>
                                                    </div>
                                                </Col>
                                                <Col className='col-6 col-md-3'>
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder='Location' name='locationSearchBar' defaultValue={searchParams?.locationSearchBar} form='showingsSearchForm'/>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='px-3'>
                                                <SearchBar floating={false} blackText={true} field='showings' suggestions={movies.slice(0, 5).sort((a, b) => a.title > b.title ? 1 : -1).map((data) => {
                                                    return data.title;
                                                })}>{searchParams?.showingsSearchBar ? searchParams?.showingsSearchBar : 'Keywords, movie title, description, etc...'}</SearchBar>
                                            </Row>
                                            <Col className='m-auto text-center col-12 mt-3'>
                                                <input className='m-auto btn btn-primary rounded' type='submit' defaultValue='Search'/>
                                            </Col>
                                            </form>
                                            <Col className="col-12">
                                                {/* * * * * *
                                                  *  Movie  *
                                                  * * * * * */}
                                                <div className='row justify-content-center mx-5 mt-5'>
                                                    <h2 className='text-light mx-auto text-center'>Movies</h2>
                                                    <hr className='mt-3 mb-4 text-white w-75 mx-auto'/>
                                                    <Row>
                                                        {
                                                            movies.map((data, index) => {
                                                                return (
                                                                    <MovieCard movieId={data.id} title={data.title} imgSrc={data.poster}>
                                                                        {data.description}
                                                                    </MovieCard>
                                                                )
                                                            })
                                                        }
                                                    </Row>
                                                </div>
                                                {/* * * * * * * *
                                                  *  Theatres   *
                                                  * * * * * * * */}
                                                <div className='row justify-content-center mx-5 mt-5'>
                                                    <h2 className='text-light mx-auto text-center'>Theaters</h2>
                                                    <hr className='mt-3 mb-4 text-white w-75 mx-auto' />
                                                    <Row>
                                                        {
                                                            theaters.map((data, index) => {
                                                                return (
                                                                    <TheatreCard theatreId={data.id} title={data.theatre_name} imgSrc={'assets/theater' + (Math.floor(Math.random() * (7 - 2)) + 2) + '.jpg'}>
                                                                        {data.theatre_address}{"\n"}{data.theatre_city}{", "}{data.theatre_state}
                                                                    </TheatreCard>
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
