// Offers Array
let offers = [
    { id: "offer1", name: "Two Red Cars for the price of one!", image: "images/caroffer.jpg" },
    { id: "offer2", name: "50% discount on Batman Lego", image: "images/batmanoffer.jpg" }
];

// Function to display offers dynamically
function displayOffers() {
    var offersContainer = document.querySelector(".offers-container");
    offersContainer.innerHTML = ''; // Clear the container before adding offers

    offers.forEach((offer, index) => {
        var offerItem = document.createElement("div");
        offerItem.classList.add("offer-item");

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = offer.id;
        checkbox.name = "offers";
        checkbox.value = offer.name;

        var label = document.createElement("label");
        label.setAttribute("for", offer.id);

        var img = document.createElement("img");
        img.src = offer.image;
        img.alt = offer.name;
        img.classList.add("offer-image");

        label.appendChild(img);
        label.appendChild(document.createTextNode(offer.name));
        offerItem.appendChild(checkbox);
        offerItem.appendChild(label);
        offersContainer.appendChild(offerItem);
    });
}

// Function to delete selected offers
function deleteSelectedOffers(event) {
    event.preventDefault();
    var selectedOffers = document.querySelectorAll("input[name='offers']:checked");

    if (selectedOffers.length === 0) {
        alert("Please select at least one offer");
        return;
    }

    if (confirm("Are you sure you want to delete the selected offers?")) {
        selectedOffers.forEach(offer => {
            offers = offers.filter(o => o.id !== offer.id); 
        });
        displayOffers(); 
    }
}

// Function to add a new offer
function addNewOffer(event) {
    event.preventDefault();

    var offerName = document.getElementById("offer-name").value;
    var offerDescription = document.getElementById("offer-des").value;
    var offerImage = document.getElementById("offer-image");
    var offerProducts = document.getElementById("offer-products");
	for ( var i=0 ; i<offerProducts.length ; i++){
		if (offerProducts[i].checked)
		offerProducts+=offerProducts[i].value ; 
	}
	
    if (!offerName || !offerDescription || !offerImage.files.length || !offerProducts.selectedOptions.length) {
        alert("Please fill out all the fields.");
        return;
    }

    var newOffer = {
        id: "offer" + offers.length + 1 ,
        name: offerName,
        image: URL.createObjectURL(offerImage.files[0]) 
    };

    offers.push(newOffer);
    displayOffers();
}