const crypto = require('crypto');

const generateHashKey = (data) =>{
    if(typeof data === 'string' || data instanceof Buffer){
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest("hex");
    } else {
        throw new Error('Invalid data for hash function');
    }
}

const hashGenerator = (data) =>{
    const hashKey = generateHashKey(data);
    console.log("-----------------------At hashGenerator Function--------------------------");
    console.log("generated hash key : "+hashKey);
    return hashKey;
}


module.exports = hashGenerator;