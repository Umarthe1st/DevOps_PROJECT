document.addEventListener("DOMContentLoaded", function() {
    loadMenu();
});

function submitMenuItem(event) {
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("item-name").value;
    jsonData.description = document.getElementById("item-description").value;
    jsonData.price = parseFloat(document.getElementById("item-price").value);

    if (jsonData.name == "" || jsonData.description == "" || isNaN(jsonData.price)) {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/add-MenuItem", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);

        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Menu Item: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("item-name").value = "";
            document.getElementById("item-description").value = "";
            document.getElementById("item-price").value = "";

            toggleForm();
            loadMenu();
        } else {
            document.getElementById("message").innerHTML = 'Unable to add menu item!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function toggleForm() {
    const formContainer = document.getElementById('menu-form-container');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

function loadMenu() {
    var request = new XMLHttpRequest();
    request.open("GET", "/view-menu", true);
    request.onload = function () {
        if (request.status == 201) {
            var menuItems = JSON.parse(request.responseText);

            var menuContainer = document.getElementById("menu-container");
            menuContainer.innerHTML = "";

            menuItems.forEach(function(item) {
                var menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");
                menuItem.innerHTML = `<h3>${item.name}</h3>
                                      <p>${item.description}</p>
                                      <p>Price: $${item.price.toFixed(2)}</p>`;
                menuContainer.appendChild(menuItem);
            });
        } else {
            console.error("Failed to load menu items:", request.statusText);
        }
    };
    request.send();
}
