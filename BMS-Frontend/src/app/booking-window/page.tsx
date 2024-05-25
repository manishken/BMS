'use client';
import './page.css';

import {Carousel, CarouselItem} from "react-bootstrap";
import React, { useState, useEffect } from 'react';

import MovieCard from "@/components/MovieCard";
import {useRouter} from "next/navigation";

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

let REDIRECT_URL = ''

if(process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    REDIRECT_URL =  'https://bms-6.netlify.app'
} else {
    REDIRECT_URL = 'http://localhost:3000'
}

export default function Page() {
    const router = useRouter();
    function chunkArray(arr: Array<any>, size: number) {
        const result = [];
        while (arr.length) {
            result.push(arr.splice(0, size));
        }
        return result;
    }

    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [role, setRole] = useState<any>('');


    //let suggestions = ['Bloomington', 'Indianapolis', 'Chicago']
    let suggestions = ['Nothing ']

    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    let [citySuggestions, setcitySuggestion] = useState<string[]>([]);

    const getAllMovies = async () => {
        const responseMovies = await fetch(`${BACKEND_API_URL}get_all_movies`)
        let responseJsonMovies = await responseMovies.json()
        setMovies(responseJsonMovies);
    }
    const getAllTheaters = async () => {
        const responseTheatres = await fetch(`${BACKEND_API_URL}get_all_theatres`)
        let responseJsonTheatres = await responseTheatres.json()
        setTheaters(responseJsonTheatres);
    }

    useEffect(() => {
        const userRole = localStorage?.getItem('role')
        setRole(userRole)
    }, [])

    useEffect(() => {
        getAllMovies();
        const userRole = localStorage?.getItem('role')
        if(userRole != 'Admin' && userRole != 'Employee') {
            router.push(`/404`)
        }
    }, []);

    const getCitySuggestions = async (citySuggestionsURL: string) => {
        if (citySuggestionsURL.includes("undefined") == false) {
            const response = await fetch(citySuggestionsURL, { method: 'get' })
            const data: NearestTheatres = await response.json();
            console.log("nearest cities returned");
            console.log(data);

            data.nearestTheatres.forEach((city: cities) => {
                setcitySuggestion((prev: any) => [...prev, city.theatre_city])
            })
        }
    }

    return (
        <main style={{marginBottom: '1rem'}}>
            <div className="container-fluid p-0">

                {/* * * * * * * * * *
                  *  Movies Nearby  *
                  * * * * * * * * * */}
                <div className='row justify-content-center mx-5 mt-5'>
                    <h1 className='text-light mx-auto text-center'>Choose A Movie To Book For Patron</h1>
                    <hr className='mt-3 mb-4 text-white w-75 mx-auto'/>
                    <Carousel className='pb-4' controls={false}>
                        {
                            movies.length > 0 &&  chunkArray(movies, 4).map((chunk, idx) => (
                                <CarouselItem>
                                    <div className='row'>
                                        {chunk.map((data, idx2) => (
                                            <>
                                                <MovieCard movieId={data.id} title={data.title} imgSrc={data.poster} employeeBooking={true}>
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
                {/*<div className='row justify-content-center mx-5 mt-5'>
                    <h1 className='text-light mx-auto text-center'>Theatres</h1>
                    <hr className='mt-3 mb-4 text-white w-75 mx-auto' />
                    <Carousel className='pb-4' controls={false}>
                        {
                            theaters.length > 0 && chunkArray(theaters, 4).map((chunk, idx) => (
                                <CarouselItem>
                                    <div className='row'>
                                        {chunk.map((data, idx2) => (
                                            <>
                                                <TheatreCard theatreId={data.id} title={data.theatre_name} imgSrc={'assets/theater' + (Math.floor(Math.random() * (7 - 1)) + 2) +'.jpg'}>
                                                    {data.theatre_address}{"\n"}{data.theatre_city}{", "}{data.theatre_state}
                                                </TheatreCard>
                                            </>
                                        ))}
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </Carousel>
                </div>*/}






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
