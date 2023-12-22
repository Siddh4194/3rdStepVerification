import React, { useState } from 'react';
import './component.css';
export default function UserData(props){

    // userdata properties
    console.log(props.number);
    const [userData,setUser] = useState({
        userId:'',
        name:"",
        dob:"",
        gender:"",
        number:props.number,
        password:"",
        adhar:props.adhar,
        email:props.email
    });

    // style for the password correct or not
    const passwordStyle = {
        color: "red",
        border: "1px solid red",
      };

    // handle login change for name and all the data
    const handleChange = (event) =>{
        const {name,value} = event.target;
        setUser((prevData)=>({
            ...prevData,
            [name] : value,
        }));
        if(name === 'password'){
            const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (regex.test(value)) {
            } else {
            console.log("Password is invalid.");
            }
        }
    }

    // verification for the otp
    const [veri,setVerify] = useState(true);
    const register = () => {
        fetch('http://localhost:500/register', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: userData.userId,
            moNumber: userData.number,
            name: userData.name,
            dob: userData.dob,
            gender: userData.gender,
            password: userData.password,
            email: userData.email
          })
        })
          .then(response => {
            console.log(response.status);  // Log the HTTP status code
            return response.json();  // Return the response body as text
          })
          .then(data => {
            console.log(data);  // 
            if(data.status){
                props.authState(true);
            }
          })
          .catch(err => {
            console.log(err);
          });
      };
      
    const [hide,setHide] = useState(false);
    const checkPass = (event) =>{
        userData.password === event.target.value ? setHide(true) : setHide(false);
    }

    return(
        // login page
        <div className='logIN'>
            {
                veri ? (
                    <div className='loginDiv'>
                        <h3>Fill yor details</h3>
                            <div className='inputs'>
                                <input type="text" onChange={handleChange} name="name" placeholder='Name'/>
                                <input type="date" onChange={handleChange} name="dob" placeholder='DOB'/>
                                <select class="form-select" name='gender' onChange={handleChange} aria-label="Default select example">
                                    <option selected>Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <button onClick={()=>setVerify(!veri)} className='clear-back-button colorButton '>Next</button>
                            </div>
                    </div>
                ):(
                    <div className='loginDiv'>
                        <h3>Fill yor details</h3>
                            <div className='inputs'>
                                <input type="text"  onChange={handleChange} name="userId" placeholder='userName'/>
                                <input type="password" onChange={handleChange} style={{passwordStyle}}  name="password" placeholder='Password'/>
                                <input type="password" onChange={checkPass}  name="" placeholder='Confirm Password'/>
                                {hide ? (<button onClick={register}  className='clear-back-button colorButton '>Create Account</button>):(<h6>Check Password</h6>)}
                            </div>
                    </div>
                )
            }           
        </div>      
    )
}