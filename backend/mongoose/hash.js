const mongoose = require('mongoose');


// Assuming userIdToRetrieve is the _id of the user you want to retrieve
const prevHash = (User,userIdToRetrieve) =>{
    console.log("____________________prevHash________________________");
    return User.findById(userIdToRetrieve, 'keyhash')
        .exec()
        .then(user => {
            if (user) {
                if(user.keyhash === undefined){
                    console.log('New user new hash key is required');
                    return {hash:'',status:false}; 
                } else{
                    console.log('User hash retrieved successfully:', user.keyhash);
                    return {hash:user.keyhash,status:true};
                }
            } else {
                console.log('User not found');
                // Handle the case where the user is not found
            }
        })
        .catch(err => {
            console.error(err);
            // Handle the error
        });
}

// update the hash according to the new data
const updateHash = (User,userIdToRetrieve,hash) =>{
    console.log("---------------at updatehash---------------");
    User.findByIdAndUpdate(userIdToRetrieve, { $set: { keyhash: hash } }, { new: true })
    .exec()
    .then(updatedUser => {
        if (updatedUser) {
        console.log("Updated user:", updatedUser);
        return true;
        } else {
        console.log('User not found');
        return false;
        }
    })
    .catch(err => {
        console.error(err);
        // Handle the error
    });
}

// posts add to the cabin
const postAdd = (Post,user,postData) => {
    console.log("----------------------------add a new post in the feed ----------------------------");
    Post.findOneAndUpdate(
        { user: user },
        { $push: { content: postData } },
        { new: true }
      )
        .then((updatedUser) => {
          // If user is not there, create a new user
          if (!updatedUser) {
            let post = new Post({
              user: user,
              content: postData
            });
            return post.save();
          }
      
          console.log('Updated user:', updatedUser);
        })
        .catch((err) => {
          console.error('Error updating user:', err);
        });     
}
module.exports = {prevHash,updateHash,postAdd};
