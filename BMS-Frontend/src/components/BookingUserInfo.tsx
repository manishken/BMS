import { FunctionComponent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormError } from './Booking';


interface BookingUserInfoProps {
  bookingDetailsCallback: any
  error: FormError
}

const BookingUserInfo = ({bookingDetailsCallback, error}: BookingUserInfoProps) => {
  let user = localStorage.getItem('user')
  const role = localStorage.getItem('role')
  const [mobile, setMobile] = useState<String>('');
  const [email, setEmail] = useState<String| null>(role == 'User'? (localStorage.getItem('userEmail')?localStorage.getItem('userEmail'): ''): '')

  const handleMobile = (e:any) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 10) {
      setMobile(onlyNums);
    } else if (onlyNums.length === 10) {
      const number = onlyNums.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '($1) $2-$3'
      );
      setMobile(number);
    }
  }


  return (
    <section className='bg-white rounded-top p-1-point-5 mt-2'>
      <div>
        <div className='ml-4'>Patron's Details</div>
        <div>
          <Box
            component="form"
            className='row m-2 mt-4'
            noValidate
            autoComplete="off"
          >
            {/* <TextField InputLabelProps={{ shrink: email ? true:false }} key='email' className='mr-2' id="outlined-basic" label="Email" variant="outlined" value={email} required={true} onChange={handleEmail} onBlur={() => bookingDetailsCallback({ mobile: email })} /> */}
            
            <div className='col-md-6 col-sm-12'><TextField key='email' className='mr-2 mb-2 p-0 w-100' id="outlined-basic" label="Email" variant="outlined" value={email} required={true} error={error.email} helperText={error.email?'Please enter the patron\'s email': ''} onChange={(e)=> setEmail(e.target.value)} onBlur={() => bookingDetailsCallback({email: email})} /></div>
            <div className='col-md-6 col-sm-12'><TextField key='mobile' className='mr-2 p-0 w-100' id="outlined-basic" label="Mobile" variant="outlined" value={mobile} required={true} error={error.mobile} helperText={error.mobile?'Please enter the patron\'s mobile number': ''} onChange={(e) => handleMobile(e)} onBlur={() => bookingDetailsCallback({ mobile: mobile })} /></div>
          </Box>
        </div>
      </div>
    </section>
  )
}

export default BookingUserInfo;