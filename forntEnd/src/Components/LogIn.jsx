import React, { useState } from 'react';
import './component.css';
import UserData from './userDetails';
import checkAuthStatus from '../AuthChecker';
export default function Login(props){
    const [login,setState] = useState(false);
    const [moNumber,setNumber] = useState({
        number:"",
        name:"",
        email:""
    });

    // handle login change for name and all the data
    const handleNo = (event) =>{
        const {name,value} = event.target;
        setNumber((prevData)=>({
            ...prevData,
            [name] : value,
        }));
    }

    
    // login page
    const [userLogin,setLogIn] = useState({
        userId:"",
        password:""
    });

    // handle login change for name and all the data
    const handleLogIn = (event) =>{
        const {name,value} = event.target;
        setLogIn((prevData)=>({
            ...prevData,
            [name] : value,
        }));
    }

    // verification for the otp
    const [otp,setOtp] = useState("");
    const [veri,setVerfy] = useState(false);
    const handleOTP = (event) =>{
        const {name,value} = event.target;
        setOtp((prevData)=>({...prevData, value}));
      };

// login request
    const logIn = ()=>{
        console.log(userLogin);
        fetch('http://localhost:500/login',{
            method:"POST",
            headers:{
            'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({
                userId : userLogin.userId,
                password: userLogin.password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(data => {
            if(data.status === true){
                console.log("LogedIn");
                props.authState(true);
            } else {
                console.log("Didn't LogIn");
                props.authState(false);
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
        })
    }

    const [adhar,setAdhar] = useState('');
    var varAuth = useState({adhar:false,otp:false});
    const verifyAdhar = ()=>{
        const veriAdhar = document.querySelector('.veriAdhar');
        fetch('http://localhost:500/verifyAdhar',{
          method:"POST",
          headers:{
          'Content-Type':'application/json'
          },
          credentials:'include',
          body: JSON.stringify(
            {
                number : "+91"+moNumber.number,
                adhar:adhar
          })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if(data.status === true) {
                // set the verification value to true
                console.log("Verified successfully");
                varAuth.adhar = true;
                console.log(varAuth.adhar +" && "+ varAuth.otp);
                    setVerfy(!veri);
                if (veriAdhar) {
                    // Apply the desired styles
                    veriAdhar.style.border = '1px solid green';
                }
            } else {
                console.log("Adhar Failed");
                // Check if the input element exists
                varAuth.adhar = false;
                if (veriAdhar) {
                    // Apply the desired styles
                    veriAdhar.style.border = '1px solid red';
                    veriAdhar.value = 'Please enter valid Adhar';
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }


    const verifyOTP = ()=>{
        const veriInput = document.querySelector('.veriInput');
        fetch('http://localhost:500/verify',{
          method:"POST",
          headers:{
          'Content-Type':'application/json'
          },
          credentials:'include',
          body: JSON.stringify(
            {
                otpCode : otp,
                number:moNumber.number
          })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if(data.status === "approved") {
                // set the verification value to true

                console.log("Verified successfully");
                // setVerfy(!veri);
                varAuth.otp = true;
                if(varAuth.adhar && varAuth.otp){
                setVerfy(!veri);
                }
                veriInput.style.border = '2px solid green';
            } else {
                console.log("Invalid otp")
                varAuth.otp = false;
                // Check if the input element exists
                if (veriInput) {
                // Apply the desired styles
                veriInput.style.border = '1px solid red';
                veriInput.value = 'Please enter valid OTP'; // placeholder is not working otp is entered already
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }


    // send OTP
    const verify = () =>{
        console.log("process started");
        fetch(`http://localhost:500/storeNo`,{
          method:"POST",
          headers:{
          'Content-Type':'application/json'
          },
          credentials:'include',
          body: JSON.stringify(
            {
            name:moNumber.name,
            number:moNumber.number
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.status);
            if(data.status) {
                // handleTab();
                // navigate("/chatbot");
                console.log("sended Successfully");
            }
          })
          .catch(err => {
            console.log(err);
            })
    }
    return(


        // login page
        <div className='logIN'>
            {
                login === true ? (
                    veri ? (
                        <UserData authState={props.authState} email={moNumber.email} adhar = {adhar} number={moNumber.number}/>     
                    ):
                    (
                        // sign up page
                        <div className='loginDiv'>
                            <h3>Sign up</h3>
                            <div className='inputs'>
                                <div className='rowInput'>
                                    <input type="text" name="number" onChange={handleNo} id="" placeholder='Email / Phone No'/>
                                    <button onClick={verify}  className='clear-back-button colorButton '>Send OTP</button>
                                </div>
                            {/* <input type="text" name="name" onChange={handleNo} placeholder='Name'/> */}
                                <div className='rowInput'>
                                    <input type="text" name="OTP" className='veriInput' onChange={handleOTP} placeholder='OTP'/>
                                    <button onClick={verifyOTP}  className='clear-back-button colorButton '>Verify OTP</button>
                                </div>
                                <div className='rowInput'>
                                    <input type="text" name="adhar" className='veriAdhar' onChange={(event) =>setAdhar(event.target.value)} placeholder='Adhar Number'/>
                                    <button onClick={verifyAdhar}  className='clear-back-button colorButton '>Verify Adhar</button>
                                </div>
                                <div className='rowInput'>
                                    <input type="email" name="email" className='veriAdhar' onChange={handleNo} placeholder='email'/>
                                </div>
                            <h6>already have an account</h6>
                            <button onClick={()=>{setState(!login)}} className='clear-back-button'>Log In</button>
                            </div>
                        </div>
                    )
                    
                ):(
                    // log in page
            <div className='loginDiv'>
                <h3>Log in</h3>
                <div className='inputs'>
                <input type="text" name="userId" id="" onChange={handleLogIn} placeholder='UserId / Phone'/>
                <input type="password" name="password" onChange={handleLogIn} placeholder='********'/>
                <button onClick={logIn} className='clear-back-button colorButton '>Log in</button>
                <a href="">forget password</a>
                <h6>Don't have an account</h6>
                <button onClick={()=>{setState(!login);}} className='clear-back-button'>Sign Up</button>
                </div>
            </div>
                )
            }
        </div>
    )
        }
