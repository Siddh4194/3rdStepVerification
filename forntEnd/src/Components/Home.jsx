import React, { useEffect, useRef, useState } from 'react';
import Post from './interface/card';

export default function Home(props){
    const scrollContainerRef = useRef(null);
    const [post,setPost] = useState(false);
    const [hash,setHash] = useState('');
    const [posted,setposted] = useState(false);
    const [postText,setPostText] = useState('');
    const verifyHash = () => {
        fetch('http://localhost:500/VerifyHash',{
            method:'POST',
            headers:{
                'content-type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({
                hash:hash
              })
        }).then(response =>{
            if(response.ok){
                return response.json();
            } else{
                throw new Error('Http error: ' + response.status);
            }
        }).then(data => {
            if(data.status === true){
                setPost(false);
                setposted(!posted);
                postGenerate();
            }
        })
    }

    const hashGenerate = (status)=>{
        // false && 
        fetch('http://localhost:500/genHash',{
            method:'POST',
            headers:{
                'content-type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({
                post:postText,
                goal:status
              })
        }).then(response =>{
            if(response.ok){
                status === "verify" && console.log(`Successfully sended to the ${props.userData.email}`);
                return response.json();
            } else{
                throw new Error('Http error: ' + response.status);
            }
        }).then(data => {
            if(data.status === true){
                status==="verify"
                ?
                console.log("Hash key is sended to the registered mail service")
                :
                setposted(!posted);
            }
        })
    }
    const logOut = ()=>{
        fetch('http://localhost:500/logout',{
            method:'Get',
            headers:{
                'Content-Type': 'application/json'
            },
            credentials:'include',
        }).then(response=>{
            if(response.ok){
                props.authState(false);
                return response.json();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }).then(data => {
            if(data.status === true){
                console.log("sended to the mail");
            } else {
                console.log("Server problem kindly try later");
            }
        })
    }
    const user = {
        name:'tohid sutar',
        photo:'img'
    }
    
    const postGenerate = () => {

        const scrollContainer = document.getElementById('your-scroll-container');
        if (scrollContainer) {
        // Scroll to the bottom smoothly
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
    return (
        <>
        <div className="home">
            <div className="nav_feed flex flex-row">
                <div className="">
                    {props.userData.name ? props.userData.username : "user"}
                    </div>
            </div>
            <div className="flex flex-col w-full bg-slate-600">
                <div className='h-14 bg-slate-600 flex flex-row-reverse items-center'>
                    {/* Header content goes here */}
                    <button className='w-max m-2.5 p-3.5 text-center flex justify-center items-center rounded h-8 bg-slate-100' onClick={logOut}>Logout</button>
                </div>
                <div id="your-scroll-container" ref={scrollContainerRef} className="flex flex-wrap  max-h-fit bg-slate-500 overflow-y-scroll border border-gray-500 pt-7  scroll-behavior-smooth">
                    <Post  user={props.userData} photo={user.photo} newPost={post}/>   
                </div>
                <div className='h-18 flex flex-row-reverse items-center'>
                    <button onClick={() => {hashGenerate("verify"); setPost(!post)}} className='w-max m-2.5 p-3.5 text-center flex justify-center items-center rounded h-8 bg-slate-100' id>New Post</button>
                </div>
                {
                    post ? 
                    (
                        <div className="fixed inset-0 flex items-center justify-center">
                            <div className="bg-white p-4 rounded shadow-lg h-1/2 flex flex-col items-center content-evenly">
                                <h1 className='m-5'>Enter the hash which is sended to {props.userData.email}</h1>
                                <input onChange={(event)=> setHash(event.target.value)} className='outline-none border border-solid border-gray-950 bottom-1 p-1 rounded-sm' type="text" />
                                <button onClick={verifyHash} className='m-3 bg-gray-400 p-1 rounded-sm'>Verify</button>
                            </div>
                        </div>
                    ) :
                     posted ? (
                        <div class="fixed inset-0 flex items-center justify-center">
                            <div className="bg-white p-4 rounded shadow-lg h-1/2 flex flex-col items-center content-evenly">
                                <textarea className='h-48 w-96 m-4 outline-none' onChange={(event)=>setPostText(event.target.value)} type="text" />
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center space-x-2 bg-slate-500 p-1 rounded-sm">
                                    <button onClick={()=> hashGenerate("post")}>Post</button>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        ):(<></>)
                }
            </div>
        </div>
        </>
    )
}