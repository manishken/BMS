import type { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import { sendEmail } from "@/utils/emailHelper";
import WelcomeTemplate from "../../../components/EmailTemplate";
import { NextResponse } from "next/server";
// import { sendEmail } from "../../lib/email";

export async function POST (request: any) {
    let data = await request.json();
    console.log(data)
    await sendEmail({
        to: "manishchhetry27@example.com",
        subject: "Movie ticket Confirmation",
        html: render(WelcomeTemplate({bookingId: data?.id, email: data?.email})),
      });
    
    return NextResponse.json('email-sent')
}