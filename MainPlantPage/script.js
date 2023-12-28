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

const ref1 = database.ref("SmartPlant/DHT");
const ref3 = database.ref("SmartPlant");
const ref5 = database.ref("SmartPlant/CAM");

ref1
  .once("value")
  .then((snapshot1) => {
    const data1 = snapshot1.val();
    return ref3.once("value").then((snapshot3) => {
      const data3 = snapshot3.val();
      const soilMoisture = (100 - (data3.SoilMoisture / 1024) * 100).toFixed(2);
      const humidity = (
        (data1.Humidity1 + data1.Humidity2 + data1.Humidity3) /
        3
      ).toFixed(2);
      const temperature = (
        (data1.Temperature1 + data1.Temperature2 + data1.Temperature3) /
        3
      ).toFixed(2);
      if (data3.Fall === 1) {
        document.querySelector("#fall").innerHTML = "식물이 넘어졌습니다!";
      }
      const finedust = ((data3.FineDust + data3.FineDust) / 2).toFixed(2);
      document.querySelector("#finedust").innerHTML = finedust + "㎍/m³";
      document.querySelector("#tem").innerHTML = temperature + "°C";
      document.querySelector("#hum").innerHTML = humidity + "%";
      document.querySelector("#soi").innerHTML = soilMoisture + "%";
      suggestsoilMoisture(soilMoisture);
      suggestTemperature(temperature);
      suggestHumidity(humidity);
    });
  })
  .catch((error) => {
    console.error(error);
  });

function suggestsoilMoisture(soilMoisture) {
  if (soilMoisture <= 31.64) {
    document.querySelector("#warning1").innerHTML = "물이 너무 부족해요.";
  }
}

function suggestTemperature(temperature) {
  if (temperature < 16) {
    const diff = (16 - temperature).toFixed(2);
    document.querySelector(
      "#warning2"
    ).innerHTML = `온도가 너무 낮아요. ${diff}도 정도 높여주세요.`;
  } else if (temperature > 25) {
    const diff = (temperature - 25).toFixed(2);
    document.querySelector(
      "#warning2"
    ).innerHTML = `온도가 너무 높아요. ${diff}도 정도 낮춰주세요.`;
  }
}

function suggestHumidity(humidity) {
  if (humidity < 40) {
    const diff = (40 - humidity).toFixed(2);
    document.querySelector(
      "#warning3"
    ).innerHTML = `습도가 너무 낮아요. ${diff}% 정도 높여주세요.`;
  } else if (humidity > 70) {
    const diff = (humidity - 70).toFixed(2);
    document.querySelector(
      "#warning3"
    ).innerHTML = `습도가 너무 높아요. ${diff}% 정도 낮춰주세요.`;
  }
}

ref5.once("value").then((snapshot5) => {
  const data5 = snapshot5.val();
  var photoURL = data5.Picture;
  var img = document.getElementById("img1");
  return (img.src = photoURL);
});

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

  getLatestBoard();
};

const getLatestBoard = () => {
  if (boards.length > 0) {
    const latestBoard = boards[boards.length - 1];
    displayBoards(latestBoard);
  }
};

getBoards();
