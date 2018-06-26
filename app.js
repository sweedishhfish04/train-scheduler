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
    var hoursAndMinutes = time.split(':')
    var date = new Date()
    date.setUTCHours(hoursAndMinutes[0])
    date.setUTCMinutes(hoursAndMinutes[1])

    firebase.database().ref('train/' + name.replace(/ /g, '')).set({
        trainName: name,
        destination: destination,
        initialTime: date.toUTCString(),
        frequency: frequency
    })
}

function getDatabaseRecords() {
    $('#times').html('<tr><th>Train Name</th><th>Destination</th><th>Frequency</th><th>Next Arrival</th><th>Minutes Away</th></tr>')
    firebase.database().ref('train').once('value').then(function (snapshot) {
        snapshot.forEach(function (entry) {
            var offset = new Date().getTimezoneOffset()
            var nextArrival = new Date(entry.val().initialTime)
            
            console.log(entry.val().initialTime)

            var now = new Date()
            while(nextArrival < now) {
                nextArrival = moment(nextArrival).add(entry.val().frequency, 'm').toDate()
            }
            var minutesAway = Math.round((nextArrival - now) / 60000)

            $('#times').append('<tr><td>' + entry.val().trainName + '</td><td>' + entry.val().destination + '</td><td>' + entry.val().frequency + '</td><td>' + moment(nextArrival).format('LT') + '</td><td>' + minutesAway + '</td></tr>')
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
})

getDatabaseRecords()