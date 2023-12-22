import './App.css';
import Login from './Components/LogIn';
import './Components/component.css';
import { useEffect, useState } from 'react';
import Home from './Components/Home';
import checkAuthStatus from './AuthChecker';
function App() {
  const [authStatus,setAuth] = useState(true);
  const [userData,setData] = useState([]);
  const authState = (state) =>{
    setAuth(state);
  }
  var data;
  useEffect(()=>{
    checkAuthStatus(authState,setData);
    console.log(data);
    setAuth(data);
  },[]);
  return (
    <div className="App">
      {
        authStatus
        ?
        <Home authState={authState} userData={userData}/>
        :
        <Login authState={authState}/>
      }
      
    </div>
  );
}

export default App;
