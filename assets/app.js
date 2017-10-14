  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCOD96IMMFINtZ_Vi-rNZ5EQ5JZ_YvpDQI",
    authDomain: "train-schedul-e5628.firebaseapp.com",
    databaseURL: "https://train-schedul-e5628.firebaseio.com",
    projectId: "train-schedul-e5628",
    storageBucket: "train-schedul-e5628.appspot.com",
    messagingSenderId: "522466720999"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

//Take user input and push to firebase
$("#add-btn").on("click", function(){
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = moment($("#first-time").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#frequency").val().trim();

  var newTrain = {
    name: trainName,
    place: destination,
    ftt: firstTrainTime,
    freq: frequency
  };

  database.ref().push(newTrain);
  console.log(newTrain);
  //reset fields after taking input
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-time").val("");
  $("#frequency").val("");
  //prevents refresh or page change on click
  return false;
});

//"Listen" for a change in the DB and update the table if something has been added
database.ref().on("child_added", function(childSnapshot){
  console.log(childSnapshot.val());

  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().place;
  var firstTrain = childSnapshot.val().ftt;
  var frequency = childSnapshot.val().freq;
  var fttConverted = moment(firstTrain, "HH:mm");
  console.log(fttConverted);
  var currentTime = moment().format("HH:mm");
  console.log("Current time: " + currentTime);
  //Store difference between the current time and the first train time
  var tDiff = moment().diff(moment(fttConverted), "minutes");
  console.log("Latest first train time: " + firstTrain);
  console.log("Time difference: " + tDiff);
  var tRemainder = tDiff % frequency;
  console.log("Remainder: " + tRemainder);
  var minLeft = frequency - tRemainder;
  var nextTrain = moment().add(minLeft, "minutes").format("HH:mm");
  $("#table-bod").append(
    "<tr><td>" + trainName +
    "</td><td>" + destination +
    "</td><td>" + frequency +
    "</td><td>" + nextTrain +
    "</td><td>" + minLeft +
    "</td></tr>");
});