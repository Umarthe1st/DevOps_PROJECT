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
                '<button type="button" class="btn btn-warning"onclick="editReservation(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') +'\')">Edit </button> ' +
                '<button type="button" class="btn btn-danger"onclick="deleteReservation(' + response[i].id + ')"> Delete</button>' +
                '</td>'+
            '</tr>'
        }

        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}
function editReservation(data) {
    var selectedReservation = JSON.parse(data);
    document.getElementById("editName").value = selectedReservation.customer_name;
    document.getElementById("editLocation").value = selectedReservation.location;
    document.getElementById("editDate").value = selectedReservation.date;
    document.getElementById("editTime").value = selectedReservation.time;
    document.getElementById("editGuests").value = selectedReservation.number_of_guests;
    document.getElementById("editContact").value = selectedReservation.contact_info;
    document.getElementById("updateButton").setAttribute("onclick", 'updateReservation("' + selectedReservation.id + '")');
    $('#editReservationModal').modal('show');
}

function updateReservation(id) {
    var jsonData = {
        customer_name: document.getElementById("editName").value,
        location: document.getElementById("editLocation").value,
        date: document.getElementById("editDate").value,
        time: document.getElementById("editTime").value,
        number_of_guests: parseInt(document.getElementById("editGuests").value),
        contact_info: document.getElementById("editContact").value
    };

    // Validation on the client-side
    if (!jsonData.customer_name || !jsonData.location || !jsonData.date || !jsonData.time || !jsonData.number_of_guests || !jsonData.contact_info) {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-reservation/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        var response = JSON.parse(request.responseText);
        if (response.message === "Reservation modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Reservation: ' + jsonData.customer_name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'index.html';
        } else {
            document.getElementById("editMessage").innerHTML = response.message || 'Unable to edit reservation!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function deleteReservation(selectedId) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-reservation/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message === "Reservation deleted successfully!") {
            window.location.href = 'index.html';
        } else {
            alert('Unable to delete reservation!');
        }
    };
    request.send();
}