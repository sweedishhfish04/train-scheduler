var config = {
    apiKey: "AIzaSyDjzNlRLQcMj93B_UXbSKYvfFa5Fta9zXU",
    authDomain: "train-scheduler-fc482.firebaseapp.com",
    databaseURL: "https://train-scheduler-fc482.firebaseio.com",
    projectId: "train-scheduler-fc482",
    storageBucket: "",
    messagingSenderId: "1091626654616"
};
firebase.initializeApp(config);


function addTrainToDatabase(name, destination, time, frequency) {
    firebase.database().ref('train/' + name.replace(/ /g, '')).set({
        trainName: name,
        destination: destination,
        initialTime: time,
        frequency: frequency
    })
}

function getDatabaseRecords() {
    $('#times').html('<tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Next Arrival</th><th>Minutes Away</th></tr>')
    firebase.database().ref('train').once('value').then(function (snapshot) {
        snapshot.forEach(function (entry) {
            console.log(entry.val())
            $('#times').append('<tr><td>' + entry.val().trainName + '</td><td>' + entry.val().destination + '</td><td>' + entry.val().frequency + '</td><td>' + entry.val().initialTime + '</td><td>' + 5 + '</td></tr>')
        })
    })
}


$("#submit").click(function () {
    var name = $("#name").val()
    var destination = $("#destination").val()
    var first = $("#first").val()
    var min = $("#min").val()

    addTrainToDatabase(name, destination, first, min)
    setTimeout(getDatabaseRecords, 200)


    console.log(name, destination, first, min)
})



getDatabaseRecords()

console.log(moment().format('LT'))

//addTrainToDatabase("MN_Karma_Train", "Miramar", "Now", 25)
//var hoursAndMinutes = first.split(':')
//first = new Date(Date.UTC(0, 0, 0, hoursAndMinutes[0], hoursAndMinutes[1]))