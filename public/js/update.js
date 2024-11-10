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