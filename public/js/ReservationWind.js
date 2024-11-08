function createReservation() {
    var response = "";

    var jsonData = new Object();
    jsonData.customer_name = document.getElementById("customer_name").value;
    jsonData.location = document.getElementById("location").value;
    jsonData.date = document.getElementById("date").value;
    jsonData.time = document.getElementById("time").value;
    jsonData.number_of_guests = document.getElementById("number_of_guests").value;
    jsonData.contact_info = document.getElementById("contact_info").value;


    if (jsonData.customer_name == "" || jsonData.location == "" || jsonData.date == "" || jsonData.time == "" || jsonData.number_of_guests == "" || jsonData.contact_info == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "/reservation", true);
    request.setRequestHeader("Content-Type", 'application/json');

    request.onload = function () {
        if (request.status >= 400) {
            var response = JSON.parse(request.responseText);
            document.getElementById("message").innerHTML = response.error || 'An error occurred. Please try again.';
            document.getElementById("message").setAttribute("class", "text-danger");
        } else {
            response = JSON.parse(request.responseText);
            console.log(response);
            if (response.message == undefined) {
                document.getElementById("message").innerHTML = 'Reservation Booked Under: ' + jsonData.customer_name + '!';
                document.getElementById("message").setAttribute("class", "text-success");
                document.getElementById("location").value = "";
                document.getElementById("date").value = "";
                document.getElementById("time").value = "";
                document.getElementById("number_of_guests").value = "";
                document.getElementById("contact_info").value = "";
                window.location.href = 'index.html';
            }
        }
    };

    request.send(JSON.stringify(jsonData));
}

function viewReservation() {
    var response = '';
    var request = new XMLHttpRequest();

    request.open('GET', '/view-reservation', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);

        var html = ''
        for (var i = 0; i < response.length; i++)
        {
            html += '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td>' + response[i].booking_id + '</td>' +
                '<td>' + response[i].customer_name + '</td>' +
                '<td>' + response[i].location + '</td>' +
                '<td>' + response[i].date + '</td>' +
                '<td>' + response[i].time + '</td>' +
                '<td>' + response[i].number_of_guests + '</td>' +
                '<td>' + response[i].contact_info + '</td>' + 
                '<td>' +
                '<button type="button" class="btn btn-warning" onclick="">Edit</button> ' +
                '<button type="button" class="btn btn-warning" onclick="">Delete</button> ' +
                '</td>'+
            '</tr>'
        }

        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}