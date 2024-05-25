import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

let REDIRECT_URL = ''

if(process.env.NEXT_PUBLIC_BACKEND_API_URL) {
    REDIRECT_URL =  'https://bms-6.netlify.app'
} else {
    REDIRECT_URL = 'http://localhost:3000'
}

export async function POST (request: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    let data = await request.json();
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                quantity: data?.paymentData?.quantity,
                price_data: {
                    currency: 'USD',
                    unit_amount: data?.paymentData?.price  * 100,
                    product_data: {
                        name: data?.paymentData?.movieName,
                    }
                }
            }
        ],
      mode: 'payment',
      success_url: `${REDIRECT_URL}/confirm-booking?bookingId=${data?.paymentData?.bookingId}&email=${data?.paymentData?.email}`,
      cancel_url: REDIRECT_URL
    })

    return NextResponse.json(session.url)
}