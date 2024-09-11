import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { loginRequest, msalInstance } from "../config/msalConfig";
import { localData } from "../utils/storage";
import "../components/Login.css";
import ptg from "../assets/Images/logo-ptg.svg";
import cmsbg from "../assets/Images/cms-bg.svg"
import logoicon from "../assets/Images/logoicon.svg"
import { useNavigate } from 'react-router-dom';
import { authenticate } from "../services/AWSService";
import { useMsal } from "@azure/msal-react";
import ms from "../assets/Images/ms.png";

const Login = () => {
    //aws
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const { instance, accounts } = useMsal();
    const formInputChange = (formField, value) => {
        if (formField === "email") {
            setEmail(value);
        }
        if (formField === "password") {
            setPassword(value);
        }
    };

    const validation = () => {
        return new Promise((resolve, reject) => {
            if (email === '' && password === '') {
                setEmailErr("Email is Required");
                setPasswordErr("Password is required");
                toast.warning("Email and Password are required");
                resolve({ email: "Email is Required", password: "Password is required" });
            }
            else if (email === '') {
                setEmailErr("Email is Required");
                toast.warning("Email is Required");
                resolve({ email: "Email is Required", password: "" });
            }
            else if (password === '') {
                setPasswordErr("Password is required");
                toast.warning("Password is required");
                resolve({ email: "", password: "Password is required" });
            }
            else if (password.length < 6) {
                setPasswordErr("must be 6 character")
                toast.warning("must be 6 character");
                resolve({ email: "", password: "must be 6 character" });
            }
            else {
                setIsLoading(true);
                resolve({ email: "", password: "" });
            }
        });
    };
    const handleClick = (e) => {
        e.preventDefault();
        setEmailErr("");
        setPasswordErr("")
        validation()
            .then((res) => {
                if (res.email === '' && res.password === '') {
                    authenticate(email, password)
                        .then((data) => {
                            console.log("Token login=> " + data.getIdToken().getJwtToken().toString())
                            localData.set("TOKEN", data.getIdToken().getJwtToken().toString())
                            const expirationTime = data.getIdToken().payload.exp;
                            localData.set("TOKEN_EXPIRATION", expirationTime);
                            localStorage.setItem('loggedIn', 'true');
                            console.log(expirationTime)
                            window.location.reload()
                            setIsLoading(false);
                            setLoginErr('');
                        }, (err) => {
                            toast.error(err.message);
                            console.log("Error=> " + err);
                            setLoginErr(err.message);
                            setIsLoading(false);
                        })
                        .catch(err => console.log("Error catch" + err))
                }
            }, err => {
                console.log(err);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }
    //aws

    // Azure login

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (accounts?.length) {
            getProfileData()
        }
    }, [accounts])

    const handleMicrosoftLogin = async () => {
        const tokenResponce = await instance.handleRedirectPromise();
        console.log(tokenResponce, 'tokenREsponce');
        // handleResponce(tokenResponce)
        const myAccount = instance?.getAllAccounts()
        if (myAccount.length <= 0) {
            let data = instance?.loginRedirect(loginRequest).then((res => {
                console.log(res, 'res');
            }))
        }

    };



    const getProfileData = () => {
        if (accounts) {
            const request = {
                ...loginRequest,
                account: accounts[0]
            };

            instance.acquireTokenSilent(request).then(response => {
                fetch('https://graph.microsoft.com/v1.0/me', {
                    headers: {
                        Authorization: `Bearer ${response.accessToken}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data, 'profile');
                        localData.set("TOKEN", response?.accessToken);
                        //localData.set("TOKEN", response.accessToken);
                        localStorage.setItem('loggedIn', 'true');
                        window.location.reload();
                    }
                    );
            });
        }
    }


    //ommm
    return (
        <>
            <div className="login-container">
                <div className="leftsec">
                    <div className="boxsec">
                        <h1 className="logintitle text-white text-uppercase">Cluster <br /> Management <br />system</h1>
                        <div className="imgsec">
                            <img src={cmsbg} alt="cms" />
                        </div>
                    </div>
                </div>
                <div className="rightsec">
                    <div className="rightboxsec">
                        <div className="rightbox">
                            <div className="image-container">
                                <img src={ptg} alt="people_tech" />
                            </div>
                            <img src={logoicon} alt="logoicon" />
                            <Form className="mt-4">
                                {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => formInputChange("email", e.target.value)}
                            helperText={emailErr}
                            required={true}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required={true}
                            value={password}
                            helperText={passwordErr}
                            onChange={(e) => { formInputChange("password", e.target.value) }}
                        />
                    </Form.Group>
                    <div style={{ textAlign: "center" }}>
                        <Button variant="secondary" className="w-100" type="submit" onClick={(e) => handleClick(e)}>
                            Submit
                        </Button>
                    </div> */}
                                <div style={{ textAlign: "center" }} className="mt-3">
                                    <Button className="msbtn" onClick={handleMicrosoftLogin} disabled={isLoading}>
                                        {isLoading ? <span><img src={ms} /> Logging in... </span> : <span><img src={ms} /> Sign in with Microsoft </span>}

                                    </Button>
                                </div>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                limit={1}
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ minWidth: "100px" }}
                transition={Zoom}
            />
        </>
    );
};

export default Login;
