const checkAuthStatus = (authStatus,setData) => {
    fetch('http://localhost:500/checkAuth', {
        method: "Get",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
        })
        .then(response => {
        if (response.ok) {
            // Response is successful
            return response.json();
        } else {
            // Response is not successful
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        })
        .then(data => {
        // Process the JSON response
            if(data.status){
                console.log("autherized");
                authStatus(true);
                setData(data.user);
                console.log(data.user);
            } else{
                console.log(data.status);
                authStatus(false);
            }
        })
        .catch(err => {
             return false;
    });
}
export default checkAuthStatus;