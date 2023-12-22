import React, { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import Favorite from '@mui/icons-material/Favorite';
export default function Post(props) {
  const [posts,setPosts] = useState([]);
  var [newArray,setNewArray] = useState([]); 
  
  const renderPosts = () => {
    fetch(`http://localhost:500/postData`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.status);
      if (data.status) {
        setPosts(data.posts[0].content);
        console.log(data.posts[0].content);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
    });
}

useEffect(() => {
  renderPosts();
}, []);

const formatTimeDifference = (date) => {
  const currentDate = new Date();
  const commentDate = new Date(date);
  const timeDifference = currentDate - commentDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
};

useEffect(() => {
  if (posts.length > 0) {
    setNewArray(
      posts.map((currentValue, index) => (
        <div key={index} className="max-w-md max-h-60  w-full bg-white p-3 rounded-md shadow-md m-1.5">
          <div className="flex items-center mb-4">
            <img src="/images/ganesha.jpg" alt="profile" className="w-10 h-10 rounded-full mr-4"/>
            <div>
              <p className="font-semibold">{props.user.username}</p>
              <p className="text-gray-500 text-sm">{
                 formatTimeDifference(currentValue.commentOn)
              }</p>
            </div>
          </div>
          {/* <button onClick={renderPosts}>Get Posts</button> */}
          <p className="text-lg mb-4">{currentValue.text}</p>
    
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Favorite/>
              <SendIcon/>
              <CommentIcon/>
            </div>
            <div className="flex items-center space-x-2">
              
            </div>
          </div>
        </div>
      ))
    );
  }
}, [posts]);


  return(
      <>
      {
        !props.newPost ?
          <>{newArray}</>
          // {newArray}
          // <div class="max-w-md w-full bg-white p-6 rounded-md shadow-md my-1.5">
          //   <div class="flex items-center mb-4">
          //     <img src="/images/ganesha.jpg" alt="profile" srcset="" className="w-10 h-10 rounded-full mr-4"/>
          //     <div>
          //       <p class="font-semibold">John Doe</p>
          //       <button onClick={renderPosts}>click me</button>
          //       <p class="text-gray-500 text-sm">Posted 3 hours ago</p>
          //     </div>
          //   </div>

          //   <textarea className='h-48 w-96 m-4 outline-none' type="text" />

          //   <div class="flex justify-between items-center">
          //     <div class="flex items-center space-x-2 bg-slate-500 p-1 rounded-sm">
          //       <button>Post</button>
          //     </div>
          //   </div>
          // </div>
        
         :
        (
          <div class="max-w-md w-full bg-white p-6 rounded-md shadow-md my-1.5">
            <div class="flex items-center mb-4">
              <img src="/images/ganesha.jpg" alt="profile" srcset="" className="w-10 h-10 rounded-full mr-4"/>
              <div>
                <p class="font-semibold">John Doe</p>
                <button onClick={renderPosts}>click me</button>
                <p class="text-gray-500 text-sm">Posted 3 hours ago</p>
              </div>
            </div>

            <textarea className='h-48 w-96 m-4 outline-none' type="text" />

            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-2 bg-slate-500 p-1 rounded-sm">
                <button>Post</button>
              </div>
            </div>
          </div>
        )
      }
      </>
  )
}