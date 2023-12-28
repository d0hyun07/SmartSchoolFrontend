function showRegistrationForm() {
  var registrationForm = document.getElementById("registration-form");
  registrationForm.style.display = "block";
}

function registerPlant() {
  var nameInput = document.getElementById("plant-name-input");
  var speciesInput = document.getElementById("plant-species-input");

  var name = nameInput.value;
  var species = speciesInput.value;

  if (name && species) {
    var plantContainer = document.getElementById("plant-container");

    var box = document.createElement("div");
    box.classList.add("box");

    var plantName = document.createElement("div");
    plantName.classList.add("plant-name");
    plantName.innerText = name;

    var plantSpecies = document.createElement("div");
    plantSpecies.classList.add("plant-species");
    plantSpecies.innerText = species;

    box.appendChild(plantName);
    box.appendChild(plantSpecies);

    plantContainer.appendChild(box);

    nameInput.value = "꽃이름";
    speciesInput.value = "꽃종류";
    var registrationForm = document.getElementById("registration-form");
    registrationForm.style.display = "none";
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyD_OVBu1vG6CKvtFprxu6qZrfyb563N4FY",
  authDomain: "smartplant-42fd1.firebaseapp.com",
  databaseURL: "https://smartplant-42fd1-default-rtdb.firebaseio.com",
  projectId: "smartplant-42fd1",
  storageBucket: "smartplant-42fd1.appspot.com",
  messagingSenderId: "797402641206",
  appId: "1:797402641206:web:f528f7ae695643ecc87997",
  measurementId: "G-MFZSF5VC8G",
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let boards = [];
let names = [];
let subCategories = [];

const getBoards = async () => {
  const board = database.ref("SmartPlant").child("PLANTS");
  await board.once("value").then((snapshot7) => {
    snapshot7.forEach((childSnapshot) => {
      const boardData = {
        name: childSnapshot.val().name,
        subCategory: childSnapshot.val().subCategory,
      };

      boards.push(boardData);
      names.push(boardData.name);
      subCategories.push(boardData.subCategory);
    });
  });
};

// Replace the displayBoards function
function displayBoards(boards) {
  const container = document.getElementById("board-container");

  // If the container element is not valid, exit the function
  if (!container) {
    return;
  }

  // Clear the existing content in the container
  container.innerHTML = "";

  // Create and insert data boxes for each board
  boards.forEach((board) => {
    const dataBox = document.createElement("div");
    dataBox.classList.add("board-box");

    const nameElement = document.createElement("p");
    nameElement.textContent = `Name: ${board.name}`;
    dataBox.appendChild(nameElement);

    const subCategoryElement = document.createElement("p");
    subCategoryElement.textContent = `SubCategory: ${board.subCategory}`;
    dataBox.appendChild(subCategoryElement);

    dataBox.addEventListener("click", () => {
      // Replace 'https://example.com' with the actual URL you want to navigate to
      window.location.href = "../MainPlantPage/MainPlantPage.html";
    });

    container.appendChild(dataBox);
  });
}

// Call the getBoards function
getBoards().then(() => {
  console.log(boards); // Make sure the data is fetched successfully
  displayBoards(boards); // Display the boards in the HTML
});
