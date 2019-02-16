import * as firebase from 'firebase';
import swal from 'sweetalert';

const config = {
    apiKey: "AIzaSyAHdK_aCAVU6ov8INcoO-Aa9OAxb1beaSU",
    authDomain: "hassaan-feb-12-2019.firebaseapp.com",
    databaseURL: "https://hassaan-feb-12-2019.firebaseio.com",
    projectId: "hassaan-feb-12-2019",
    storageBucket: "hassaan-feb-12-2019.appspot.com",
    messagingSenderId: "505333331082"
};
firebase.initializeApp(config);

var db = firebase.firestore();

function create(obj) {
    return new Promise((reso, reje)=>{
        getById(obj.id).then((res) => {
            if (res !== "No such document!") {
                db.collection("myList").doc(obj.id).update(obj)
                    .then(() => {
                        //swal("Success", "Save Successfully..", "success");
                        reso("Done");
                    })
                    .catch((err) => {
                        swal("Error", err, "error");
                    })
            }
            else {
                db.collection("myList").doc(obj.id).set(obj)
                    .then(() => {
                        //swal("Success", "Save Successfully..", "success");
                        reso("Done");
                    })
                    .catch((err) => {
                        swal("Error", err, "error");
                    })
            }
        })
    })
    

}

function read() {

    return new Promise((res, rej) => {
        var myList = [];
        db.collection("myList").get().then(function (querySnapshot) {
            //console.log(querySnapshot);
            if(querySnapshot.docs.length == 0){
                res(myList);
            }
            else{
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    myList.push(doc.data());
                    res(myList);
                });
            }
            
        });
        
    })

}

function getById(id) {
    return new Promise((res, rej) => {
        var docRef = db.collection("myList").doc(id);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                res(doc.data());
            } else {
                res("No such document!");
            }
        }).catch(function (error) {
            //console.log("Error getting document:", error);
        });
    })

}

function deleteFirebase(id) {
    return new Promise((res, rej) => {
        db.collection("myList").doc(id).delete().then(function () {
            //console.log("Delete from firebase.js");
            read().then((resp)=>{
                //console.log(resp);
                res(resp);
                
                
            })
        }).catch(function (error) {
            //console.error("Error removing document: ", error);
        });
    })

}

export { create, read, getById, deleteFirebase, db };