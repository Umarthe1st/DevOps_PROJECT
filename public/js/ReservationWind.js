function createReservation() {
    var response = "";

    var jsonData = new Object();
    jsonData.customer_name = document.getElementById("customer_name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.date = document.getElementById("date").value;
    jsonData.time = document.getElementById("time").value;
    jsonData.number_of_guests = document.getElementById("number_of_guests").value;
    jsonData.contact_info = document.getElementById("contact_info").value;


    if (jsonData.customer_name == "" || jsonData.date == "" || jsonData.time == "" || jsonData.number_of_guests == "" || jsonData.contact_info == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "/reservation", true);
    request.setRequestHeader("Content-Type", 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Reservation Book Under:' +jsonData.customer_name + '!';
            document.getElementById("location").value = "";
            document.getElementById("date").value = "";
            document.getElementById("time").value = "";
            document.getElementById("number_of_guests").value = "";
            document.getElementById("contact_info").value = "";
            window.location.href = 'index.html';
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to book a reservation!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}