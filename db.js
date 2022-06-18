//Connect to database
//indexed db me object store jaise sql me table
let db;
let openRequest=indexedDB.open('myDatabase');
openRequest.addEventListener('success',()=>{
    console.log("db connected");
    db=openRequest.result;//When a request is completed, returns the result, or undefined if the request failed
})

openRequest.addEventListener('upgradeneeded',()=>{
    console.log("db upgraded or initalised db");
    db=openRequest.result;

    db.createObjectStore('video',{keyPath:"id"});
    db.createObjectStore('image',{keyPath:"id"});
})

openRequest.addEventListener('error',()=>{
    console.log("db error");
})

