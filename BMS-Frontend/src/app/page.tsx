'use client';
import './page.css';

import { Carousel, CarouselItem } from "react-bootstrap";
import React, { useState, useEffect } from 'react';

import SearchBar from '@/components/SearchBar'
import MovieCard from "@/components/MovieCard";
import TheatreCard from "@/components/TheatreCard";
import { faL } from '@fortawesome/free-solid-svg-icons';

interface NearestTheatres {
    nearestTheatres: cities[]
}

interface cities {
    id: string,
    theatre_name: string,
    theatre_city: string,
    difference: string
}

let BACKEND_API_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
} else {
    BACKEND_API_URL = 'http://127.0.0.1:8000/'
}
export default function Page() {

    Array.prototype.chunk = function (size) {
        const result = [];

        while (this.length) {
            result.push(this.splice(0, size));
        }

        return result;
    };

    const [movies, setMovies] = useState(Array);
    const [theaters, setTheaters] = useState(Array);

    //let suggestions = ['Bloomington', 'Indianapolis', 'Chicago']
    let defaultSuggestions = ['No Suggestions. Geolocation is disabled']

    const [error, setError] = useState('');
    let [citySuggestions, setcitySuggestion] = useState<string[]>([]);

    const [runApiCall, setRunApiCall] = useState(true);

    useEffect(() => {
        // Check if the Geolocation API is supported
        if (navigator.geolocation) {
            // Get the current position
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    //console.log("Lat: " + latitude + " Long: " + longitude);
                    apiCallFull(true, latitude, longitude);
                },
                err => {
                    //setError(err.message);
                    apiCallNoLocation()
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: Infinity
                }
            );
        } else {
            console.log("Geolocation denied");
            setError("Geolocation is not supported by this browser.");
        }
        
    }, []);

    const apiCallNoLocation = async () => {
        const mainUrl = BACKEND_API_URL + 'homepage_main_get?longitude=0&latitude=0';
        const mainResponse = await fetch(mainUrl);
        const responseJson = await mainResponse.json();
        setMovies(responseJson.movie_matches);
        setTheaters(responseJson.theater_matches);
        setcitySuggestion(defaultSuggestions);
    }

    const apiCallFull = async (coordsReceived: boolean, latitude: number, longitude: number) => {
        const mainUrl = BACKEND_API_URL + 'homepage_main_get?longitude=' + longitude + '&latitude=' + latitude;
        const mainResponse = await fetch(mainUrl);
        const responseJson = await mainResponse.json();
        setMovies(responseJson.movie_matches);
        setTheaters(responseJson.theater_matches);
        const nearestTheatres = responseJson.nearestTheatres;
        nearestTheatres.forEach((city: cities) => {
            setcitySuggestion((prev: any) => [...prev, city.theatre_city])
        })
    }

    return (
        <main style={{ marginBottom: '1rem' }}>
            <div className="container-fluid p-0">
                <div className="row-fluid p-0">
                    <div className="card border-0">
                        <img className="card-img rounded-0" src="assets/theater1.jpg" draggable="false" alt="Movie theater." />
                        <div className="card-img-overlay d-flex justify-content-center align-items-center mb-5">
                            <h1 className="display-1 fw-bold text-white text-center">Now Playing...</h1>
                        </div>
                        <form action='/search' method='get'>
                            <SearchBar floating={true} field='location'
                                suggestions={citySuggestions}
                            >Find theaters near you...</SearchBar>
                        </form>
                    </div>
                </div>

                {/* * * * * * * * * *
                  *  Movies Nearby  *
                  * * * * * * * * * */}
                <div className='row justify-content-center mx-5 mt-5'>
                    <h1 className='text-light mx-auto text-center'>Movies</h1>
                    <hr className='mt-3 mb-4 text-white w-75 mx-auto' />
                    <Carousel className='pb-4' controls={false}>
                        {
                            movies?.length > 0 && movies.chunk(4).map((chunk, idx) => (
                                <CarouselItem >
                                    <div className='row' >
                                        {chunk.map((data, idx2) => (
                                            <>
                                                <MovieCard movieId={data.id} title={data.title} imgSrc={data.poster} >
                                                    {data.description}
                                                </MovieCard>
                                            </>
                                        ))}
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </Carousel>
                </div>

                {/* * * * * * * * * *
                  *  Theatres Nearby  *
                  * * * * * * * * * */}
                <div className='row justify-content-center mx-5 mt-1'>
                    <h1 className='text-light mx-auto text-center'>Theatres</h1>
                    <hr className='mt-3 mb-4 text-white w-75 mx-auto' />
                    <Carousel className='pb-4' controls={false}>
                        {
                            theaters?.length > 0 && theaters.chunk(4).map((chunk, idx) => (
                                <CarouselItem>
                                    <div className='row'>
                                        {chunk.map((data, idx2) => (
                                            <>
                                                <TheatreCard theatreId={data.id} title={data.theatre_name} imgSrc={'assets/theater' + (Math.floor(Math.random() * (7 - 2)) + 2) + '.jpg'}>
                                                    {data.theatre_address}{"\n"}{data.theatre_city}{", "}{data.theatre_state}
                                                </TheatreCard>
                                            </>
                                        ))}
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </Carousel>
                </div>






            </div>
        </main>
    );
}


// export default function Index() {
//   return (
//     <>
//       <hr />
//       <Content />
//     </>
//   );
// }