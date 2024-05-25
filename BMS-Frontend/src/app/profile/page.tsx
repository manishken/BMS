'use client';
import 'bootstrap/dist/css/bootstrap.css';
import './page.css';

import React, { useState,useEffect  } from 'react';
import { Card, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import {Container} from "react-bootstrap";
import CircleProgress from "@/components/CircleProgress";
import OrderCard from "@/components/OrderCard";

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

function Profile() {
  const [formData, setFormData] = useState({ interests: '', genre: '' });
  const { user, isLoading } = useUser();
  const userEmail = user.email;
  const [showForm, setShowForm] = useState(true);
  
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(user)
    if (!userEmail) {
      console.error("User Email is undefined");
      return; // Exit the function if userId is not available
    }
  
    try {
      const response = await fetch(`${BACKEND_API_URL}userinfo/?email=`+encodeURIComponent(userEmail), {
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify({ ...formData }), // Adjust as per the required structure
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else{
        const data123 = await response.json();
        setShowForm(false);
      }
      // Handle successful response
    } catch (error) {
      // Handle errors
      console.error("Error in submitting form data: ", error);
    }
  };
  async function fetchUserInfo() {
    try {
        // Make an API call to your backend
        const response = await fetch(`${BACKEND_API_URL}userInfo/`+encodeURIComponent(userEmail), {
            method: 'GET',
            headers: {
                // Add headers if needed (like authentication tokens)
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is ok (status code in the range 200-299)
        if (!response.ok) {
          setShowForm(true);
            throw new Error(`Error: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        if (data) {
          // If entry exists, set showForm to false
          setShowForm(false);
        }
        else{
          setShowForm(true);
        }

        return data;
    } catch (error) {
        setShowForm(true);
        console.error('Failed to fetch user info:', error);
        // Handle errors or return a default value
        return null;
    }
  }
  useEffect(() => {
    fetchUserInfo();
  }, []);

  

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
            <main>
                <div className="container-fluid p-0">
                    <div className="row-fluid p-0 text-light">
                        <div className="row-fluid p-0">
                            <div className="border-0">
                                <Container className="m-auto mt-5 mb-5 p-5 rounded bg-dark bg-opacity-75">
                                {showForm && (
                                <Row className="gx-1 bg-darker rounded">
                                    <Col className="bg-darker rounded">
                                    <Card body className="bg-darker rounded">
                                        <Form onSubmit={handleSubmit}>
                                        <FormGroup>
                                            <Label for="interests">Interests</Label>
                                            <Input type="text" name="interests" id="interests" maxLength="255" placeholder="Enter interests" value={formData.interests} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="genre">Genre</Label>
                                            <Input type="text" name="genre" id="genre" maxLength="255" placeholder="Enter genre" value={formData.genre} onChange={handleChange} />
                                        </FormGroup>
                                        <Button className="bg-darker golden" type="submit">Save</Button>
                                        </Form>
                                    </Card>
                                    </Col>
                                </Row>)}
                                    <Row className="gx-1">
                                        <Col className="col-12 col-md-6">
                                            <Col className="col-12 text-center m-auto p-4">
                                                <Row className="bg-darker rounded">
                                                    <Row className="p-5">
                                                        <Col className="col-12 mb-3">
                                                            <img src={user.picture} alt="Profile" className="m-auto rounded-circle img-fluid profile-picture mb-3 mb-md-0" decode="async" data-testid="profile-picture"/><br/>
                                                            <p className="m-0 fw-bold">{user.name}</p>
                                                            <p className="m-0">{user.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}</p>
                                                            <p className="m-0">Registered November 2023</p>
                                                            {user.sub.includes('oauth') ? <a href="#" className="m-0 golden" style={{fontSize: '0.8rem'}}>Connected to Google</a> : null}
                                                        </Col>
                                                        <Col className="col-12">
                                                            <p className="m-0 fw-bold fs-5"><span className="golden"><svg className="d-inline  bi flex-shrink-0" width="22" height="22" role="img"><use xlinkHref="#award"/></svg> Platinum</span> (since June 2021)</p>
                                                            <a href="" className="m-0 golden" style={{fontSize: '0.75rem'}}>Billing Settings</a>
                                                        </Col>
                                                    </Row>
                                                </Row>
                                            </Col>
                                            <Col className="col-12 text-center m-auto p-4">
                                                <Row className="bg-darker rounded p-5">
                                                    <h2 className="mb-4">Rewards Points</h2>
                                                    <Col className="col-12">
                                                        <CircleProgress bgColor="yellow" percentage="45"></CircleProgress>
                                                    </Col>
                                                    <p className="mt-4 mb-0">
                                                        <span className="">450/1000 Points</span>
                                                        <br></br>
                                                        <br></br>
                                                        <a href="/rewards" className="golden">Manage Your Rewards</a>
                                                    </p>
                                                </Row>
                                            </Col>
                                        </Col>
                                        <Col className="col-12 col-md-6 text-center m-auto p-4">
                                            <Row className="bg-darker rounded p-5" style={{maxHeight: '52rem', overflow: 'scroll'}}>
                                                <h2 className="mb-4">Order History</h2>
                                                <OrderCard title="History Item #1" date="12 February 2023" time="5:20pm" cost="15.54" linkToMovieImg="assets/movie2.jpg" showingLocation="Indianapolis #12"></OrderCard>
                                                <OrderCard title="History Item #2" date="11 February 2023" time="7:15pm" cost="23.54" linkToMovieImg="assets/movie3.jpg" showingLocation="Chicago #12"></OrderCard>
                                                <OrderCard title="History Item #3" date="10 February 2023" time="1:20pm" cost="24.21" linkToMovieImg="assets/movie4.jpg" showingLocation="Bloomington #12"></OrderCard>
                                                <OrderCard title="History Item #4" date="9 February 2023" time="11:45am" cost="56.37" linkToMovieImg="assets/movie5.jpg" showingLocation="Louisville #12"></OrderCard>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: (error: { message: any; }) => <ErrorMessage>{error.message}</ErrorMessage>
});
