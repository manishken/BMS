'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import AdminBar from '../../components/AdminPageAnaytics1'
import AdminLine from '@/components/AdminPageAnaytics2';
import { AdminRadar } from '@/components/Adminpageanaytics3';

let REDIRECT_URL = ''

if (process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    REDIRECT_URL = 'https://bms-6.netlify.app'
} else {
    REDIRECT_URL = 'http://localhost:3000'
}
export default withPageAuthRequired(function page() {
    // const withPageAuthRequired(page = () => {
    const router = useRouter();
    const role = localStorage.getItem('role');
    const changeView = (page: string) => {
        if (page == 'movie') {
            router.push(`${REDIRECT_URL}/admin/add-a-movie`)
        } else if (page == 'show') {
            router.push(`${REDIRECT_URL}/admin/create-shows`)
        } else if (page == 'user') {
            router.push(`${REDIRECT_URL}/admin/view-users`)
        }
    }
    useEffect(() => {
        if (role != 'Admin') {
            router.push(`${REDIRECT_URL}/404`)
        }
    }, [])
    return (
        <div style={{overflow: 'hidden'}}>
            {role == 'Admin' && <section className='bg-white rounded-top p-5 m-5'>
                <div className='d-flex w-full justify-content-center'>
                    <button type="button" className="btn btn-primary mx-2" onClick={() => changeView('movie')}>Add Movie</button>
                    <button type="button" className="btn btn-primary mx-2" onClick={() => changeView('show')}>Create shows</button>
                    <button type="button" className="btn btn-primary mx-2" onClick={() => changeView('user')}>View Users</button>
                </div>
            </section>
            }
            <div className='row px-5 py-1'>
                <div className='col-md-6 my-2'>
                    <div className='p-5 bg-white'><div className='mt-5 p-5'><AdminBar></AdminBar></div></div>
                </div>
                <div className='col-md-6 my-2'>
                    <div className='p-5 bg-white'><div className='mt-5 p-5'><AdminLine></AdminLine></div></div>
                </div>
                <div className='col-md-6 my-2'>
                    <div className='p-5 bg-white'><div className='mt-5 p-5'><AdminRadar></AdminRadar></div></div>
                </div>
            </div>

        </div>
    );
});

// export default page;