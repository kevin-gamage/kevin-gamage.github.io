const express = require('express')
const bodyParser = require("body-parser");

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const participants = [
  'Kevin',
  "Han",
  "Mike",
  "Adelaide",
  "Andreina",
  "Angie",
  'Charity',
  "Ethan",
  "Kaden"
];

let undrawnNames = {
  "Kevin": 'Kevin',
  "Han": 'Han',
  "Mike": 'Mike',
  "Andreina": "Andreina",
  'Adelaide': 'Adelaide',
  "Angie": "Angie",
  'Charity': 'Charity',
  "Ethan": "Ethan",
  "Kaden": "Kaden",
};

let drawnNames = {};

const exceptionMap = {
  'Kevin': ["Kevin"],
  "Han": ["Han"],
  "Mike": ["Mike"],
  "Adelaide": ["Adelaide", "Mike", "Andreina"],
  "Andreina": ["Andreina"],
  "Angie": ["Angie"],
  'Charity': ["Charity"],
  "Ethan": ["Ethan"],
  "Kaden": ["Kaden"],
}

function drawName(name) {
  if (!participants.includes(name)) {
    return {
      status: "error",
      returnName: "",
      message: "You are lying! Ask Kevin to give me your real name!"
    };
  }

  const previouslyDrawnName = drawnNames[name];
  if (previouslyDrawnName) {
    return {
      status: "success",
      returnName: previouslyDrawnName,
      message: "You have already drawn a name."
    };
  } else {
    if (Object.entries(undrawnNames).length === 0) {
      return {
        status: "error",
        returnName: "",
        message: "There were no undrawn names left. Ask Kevin to reset the names to try again."
      };
    }
    const exceptions = exceptionMap[name];
    const selectableNames = Object.entries(undrawnNames).filter(([key, value]) => {
      if (!exceptions.includes(key)) {
        return { key: value };
      }
    });

    if (!selectableNames || selectableNames.length === 0) {
      return {
        status: "error",
        returnName: "",
        message: "There were no selectable names left. Ask Kevin to reset the names."
      };
    }
    const randomIndex = Math.floor(Math.random() * selectableNames.length);
    const [_, drawnName] = selectableNames[randomIndex];
    console.log(drawnName)
    drawnNames[name] = drawnName;
    delete undrawnNames[drawnName];
    return { status: 'success', returnName: drawnName, message: "" };
  }
}

function resetUndrawnNames() {
  drawnNames = {};
  participants.forEach((name) => {
    undrawnNames[name] = name;
  })
}

app.get("/api/fetchParticipants", (req, res) => {
  res.json({ 'status': 'success', "participants": participants })
  console.log("Participants have been fetched")
})

app.get("/api/fetchUndrawnNames", (req, res) => {
  res.json({ 'status': 'success', "names": undrawnNames })
  console.log("Undrawn names have been fetched.")
})

app.get('/api/drawName/:name', (req, res) => {
  var currentUser = req.params.name;
  const { status, returnName: drawnName, message } = drawName(currentUser)
  res.json({ 'status': status, 'name': drawnName, 'message': message })
  console.log("A name has been drawn.")
});

app.get('/api/resetUndrawnNames', (req, res) => {
  resetUndrawnNames();
  res.json({ 'status': 'success' });
  console.log("Undrawn names have been reset.")

});

app.listen(5000, () => { console.log("Server started on port 5000") })