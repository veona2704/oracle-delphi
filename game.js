
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const story = document.getElementById("story");
const locationText = document.getElementById("location");
const hint = document.getElementById("hint");

const tile = 20;
const player = { x: 28, y: 17 };

let found = [];
let finished = false;


let oracleQuestionIndex = 0;
let oracleAnswers = [];

const oracleQuestions = [
    {
        question: "Wat zoek je tijdens deze reis?",
        answers: [
            { text: "Kennis", type: "wijsheid" },
            { text: "Avontuur", type: "moed" },
            { text: "Geluk", type: "geluk" },
            { text: "Antwoorden", type: "lot" }
        ]
    },
    {
        question: "Je staat voor een onbekend pad. Wat doe je?",
        answers: [
            { text: "Ik onderzoek het eerst", type: "wijsheid" },
            { text: "Ik ga ervoor", type: "moed" },
            { text: "Ik vertrouw op geluk", type: "geluk" },
            { text: "Ik volg mijn bestemming", type: "lot" }
        ]
    },
    {
        question: "Wat zou je van het Orakel willen weten?",
        answers: [
            { text: "Wat de toekomst brengt", type: "lot" },
            { text: "Hoe ik sterker word", type: "moed" },
            { text: "Waar ik geluk vind", type: "geluk" },
            { text: "Wat ik nog moet leren", type: "wijsheid" }
        ]
    }
];

const oraclePredictions = {
    wijsheid: "Je zult kennis vinden op onverwachte plaatsen. Waar anderen voorbijlopen, ontdek jij aanwijzingen die je verder brengen. Maar onthoud: niet ieder antwoord maakt het lot duidelijker.",

    moed: "Er zal een moment komen waarop je moet kiezen tussen zekerheid en het onbekende. Je moed zal je ver brengen, maar zelfs de dapperste reiziger kan niet iedere uitkomst voorspellen.",

    geluk: "Het lot zal je kansen bieden wanneer je ze het minst verwacht. Niet alles zal volgens plan verlopen, maar juist in onverwachte wendingen zul je iets waardevols vinden.",

    lot: "Je probeert je toekomst te begrijpen, maar niet iedere voorspelling is wat ze lijkt. Hoe verder je zoekt naar antwoorden, hoe meer je zult ontdekken dat jouw keuzes deel uitmaken van je bestemming."
};


function openOracle() {
    finished = true;
    found.push("Het Orakel van Delphi");

    document.getElementById("oracleScreen").style.display = "flex";
    oracleQuestionIndex = 0;
    oracleAnswers = [];

    showOracleQuestion();
}

function showOracleQuestion() {
    const question = oracleQuestions[oracleQuestionIndex];

    document.getElementById("oracleProgress").textContent =
        "Vraag " + (oracleQuestionIndex + 1) + " van " + oracleQuestions.length;

    document.getElementById("oracleQuestion").textContent =
        question.question;

    document.getElementById("oracleResult").style.display = "none";
    document.getElementById("oracleQuestion").style.display = "block";
    document.getElementById("oracleAnswers").style.display = "grid";

    const answersDiv = document.getElementById("oracleAnswers");
    answersDiv.innerHTML = "";

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;

        button.onclick = function () {
            oracleAnswers.push(answer.type);
            oracleQuestionIndex++;

            if (oracleQuestionIndex < oracleQuestions.length) {
                showOracleQuestion();
            } else {
                showOraclePrediction();
            }
        };

        answersDiv.appendChild(button);
    });
}

function showOraclePrediction() {
    const counts = {
        wijsheid: 0,
        moed: 0,
        geluk: 0,
        lot: 0
    };

    oracleAnswers.forEach(answer => {
        counts[answer]++;
    });

    let chosenType = oracleAnswers[2];

    Object.keys(counts).forEach(type => {
        if (counts[type] > counts[chosenType]) {
            chosenType = type;
        }
    });

    document.getElementById("oracleProgress").textContent =
        "De Pythia heeft gesproken";

    document.getElementById("oracleQuestion").style.display = "none";
    document.getElementById("oracleAnswers").style.display = "none";
    document.getElementById("oracleResult").style.display = "block";

    document.getElementById("oraclePrediction").textContent =
        oraclePredictions[chosenType];
}


// De locaties op de kaart
const places = [
    {
        x: 26, y: 14,
        name: "De Kastalia-bron",
        text: "Volgens de overlevering wasten bezoekers zich bij de Kastalia-bron voordat ze het heiligdom betraden. Je maakt je klaar om de Heilige Weg te volgen. Je controleert of je je lupa, reader en bergies bij je hebt."
    },
    {
        x: 18, y: 11,
        name: "De schatkamers",
        text: "Langs de Heilige Weg stonden schatkamers waarin Griekse steden geschenken bewaarden. Een bekend voorbeeld is de schatkamer van de Atheners. Delphi was een belangrijk religieus centrum waar mensen uit de hele Griekse wereld naartoe kwamen."
    },
    {
        x: 10, y: 5,
        name: "Het theater",
        text: "Het theater ligt boven het heiligdom van Apollo, tegen de berghelling. Hier vonden voorstellingen plaats tijdens festivals. Je kijkt naar het landschap en denkt aan de wandelingen tijdens de reis. Gelukkig had je je bergies bij je."
    },
    {
        x: 16, y: 8,
        name: "De tempel van Apollo",
        text: "Je bereikt de tempel van Apollo, de god van onder andere profetie en kennis. Volgens een Griekse mythe versloeg Apollo Python, een slang of draak die met het heiligdom verbonden was. Daarna werd Delphi beroemd om zijn orakel. Je bent dichtbij, maar je zoektocht is nog niet voorbij."
    },
    {
        x: 24, y: 2,
        name: "Het stadion",
        text: "Hoog op de helling ligt het stadion van Delphi, waar vroeger de Pythische Spelen werden gehouden ter ere van Apollo. Net als bij de Olympische Spelen in Olympia kwamen mensen hier samen om atletiekwedstrijden te bekijken. Je denkt terug aan de stadionwedstrijd die jullie zelf in Olympia hebben gerend."
    },
    {
        x: 14, y: 2,
        name: "Het Orakel van Delphi",
        text: "Je ontmoet de Pythia, de priesteres die voorspellingen van Apollo uitsprak. Oedipus hoorde dat hij zijn vader zou doden en met zijn moeder zou trouwen. Hij probeerde dat lot te ontlopen, maar zijn pogingen speelden juist een rol in zijn tragedie. De Pythia vraagt: 'Als je probeert je lot te vermijden, bepaal je dan zelf je toekomst, of help je de voorspelling juist uitkomen?'",
        ending: true
    }
];

// Bomen en rotsen
const obstacles = [
    [2, 3], [3, 3], [4, 3],
    [8, 4], [9, 4], [10, 4],
    [3, 9], [4, 9], [5, 9],
    [22, 11], [23, 11], [24, 11],
    [28, 14], [29, 14],
    [7, 6], [7, 7], [7, 8],
    [26, 15], [27, 15],
    [12, 3], [13, 3], [14, 3],
    [3, 14], [4, 14], [5, 14]
];

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tile, y * tile, tile, tile);
}

function drawWorld() {
    // Gras
    for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 32; x++) {
            drawTile(
                x,
                y,
                (x + y) % 3 === 0 ? "#78935b" : "#829d62"
            );
        }
    }

    // Heilige Weg: een eenvoudige zigzagroute omhoog
    ctx.fillStyle = "#c7b58c";
    ctx.fillRect(500, 320, 120, 40);
    ctx.fillRect(480, 220, 40, 140);
    ctx.fillRect(260, 220, 240, 40);
    ctx.fillRect(260, 140, 40, 100);
    ctx.fillRect(260, 140, 140, 40);

    // Stenen op de weg
    for (let x = 500; x < 620; x += 30) {
        ctx.fillStyle = "#ad9c77";
        ctx.fillRect(x, 335, 12, 4);
    }

    for (let x = 280; x < 480; x += 35) {
        ctx.fillStyle = "#ad9c77";
        ctx.fillRect(x, 235, 12, 4);
    }

    // Kastalia-bron
    ctx.fillStyle = "#478eae";
    ctx.fillRect(510, 270, 30, 20);
    ctx.fillStyle = "#9dd7dc";
    ctx.fillRect(515, 275, 20, 10);

    // Schatkamers langs de Heilige Weg
    const treasuries = [
        [330, 190],
        [370, 190],
        [410, 190],
        [450, 190]
    ];

    treasuries.forEach(([x, y]) => {
        ctx.fillStyle = "#d9c79e";
        ctx.fillRect(x, y, 28, 24);

        ctx.fillStyle = "#947449";
        ctx.fillRect(x - 3, y - 5, 34, 6);

        ctx.fillStyle = "#fff0ce";
        ctx.fillRect(x + 5, y + 5, 4, 16);
        ctx.fillRect(x + 19, y + 5, 4, 16);
    });

    // Tempel van Apollo
    ctx.fillStyle = "#e1d2ae";
    ctx.fillRect(300, 120, 100, 60);

    ctx.fillStyle = "#a77b45";
    ctx.fillRect(292, 112, 116, 10);

    for (let x = 308; x <= 388; x += 20) {
        ctx.fillStyle = "#fff0ce";
        ctx.fillRect(x, 125, 8, 45);
    }

    ctx.fillStyle = "#a77b45";
    ctx.fillRect(295, 170, 110, 8);

    // Theater op de helling boven het heiligdom
    ctx.fillStyle = "#b8a17a";

    for (let i = 0; i < 5; i++) {
        ctx.fillRect(
            150 + i * 8,
            65 + i * 9,
            90 - i * 16,
            5
        );
    }

    // Stadion op het hogere deel van de kaart
    ctx.fillStyle = "#c9b78e";
    ctx.fillRect(450, 25, 130, 35);

    ctx.fillStyle = "#9e8b68";
    ctx.fillRect(460, 32, 110, 5);
    ctx.fillRect(460, 44, 110, 5);

    // Bomen en rotsen
    obstacles.forEach(([x, y], i) => {
        if (i % 2 === 0) {
            // Boom
            ctx.fillStyle = "#405b39";
            ctx.fillRect(x * tile + 2, y * tile, 16, 15);

            ctx.fillStyle = "#536f42";
            ctx.fillRect(x * tile, y * tile + 5, 20, 10);

            ctx.fillStyle = "#654a32";
            ctx.fillRect(x * tile + 8, y * tile + 13, 4, 7);
        } else {
            // Rots
            ctx.fillStyle = "#8c8777";
            ctx.fillRect(x * tile + 2, y * tile + 4, 16, 12);

            ctx.fillStyle = "#b5ac96";
            ctx.fillRect(x * tile + 5, y * tile + 4, 7, 4);
        }
    });

    // Gele blokjes geven aan welke plekken je kunt onderzoeken
    places.forEach(place => {
        if (!found.includes(place.name)) {
            ctx.fillStyle = "#f2d16b";
            ctx.fillRect(
                place.x * tile + 6,
                place.y * tile + 6,
                8,
                8
            );
        }
    });

    // De speler
    ctx.fillStyle = "#7b2638";
    ctx.fillRect(
        player.x * tile + 4,
        player.y * tile + 8,
        12,
        10
    );

    ctx.fillStyle = "#d7a477";
    ctx.fillRect(
        player.x * tile + 5,
        player.y * tile + 1,
        10,
        9
    );

    ctx.fillStyle = "#49352a";
    ctx.fillRect(
        player.x * tile + 5,
        player.y * tile + 1,
        10,
        3
    );
}

function draw() {
    drawWorld();
}

function showMessage(title, text) {
    locationText.textContent = title;
    story.textContent = text;
}

function move(dx, dy) {
    if (finished) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    // De speler mag niet buiten de kaart lopen
    if (
        newX < 0 || newX >= 32 ||
        newY < 0 || newY >= 20
    ) {
        return;
    }

    // De speler mag niet door bomen of rotsen lopen
    const blocked = obstacles.some(
        ([x, y]) => x === newX && y === newY
    );

    if (blocked) return;

    player.x = newX;
    player.y = newY;

    draw();
}

function interact() {
    if (finished) return;

    // Zoek een plek naast de speler
    const place = places.find(p =>
        Math.abs(player.x - p.x) <= 1 &&
        Math.abs(player.y - p.y) <= 1
    );

    if (!place) {
        hint.textContent =
            "Hier is niets te onderzoeken. Zoek een geel blokje!";
        return;
    }

    if (found.includes(place.name)) {
        showMessage(
            place.name,
            "Je hebt deze plek al onderzocht. Verken de rest van Delphi!"
        );
        return;
    }
    if (place.ending && !found.includes("Het stadion")) {
    hint.textContent = "Het Orakel wacht op je. Onderzoek eerst het stadion!";
    return;
}

if (place.ending) {
    openOracle();
    return;
}


    found.push(place.name);
    showMessage(place.name, place.text);

    hint.textContent =
        "Ontdekt: " + found.length + " van " + places.length + " plekken.";

    // Alleen het Orakel sluit het spel af
    if (place.ending && found.includes("Het stadion")) {
        finished = true;

        if (found.length >= 4) {
            story.textContent +=
                " Je hebt onderweg veel aanwijzingen verzameld. Je beseft dat het verhaal niet alleen over het lot gaat, maar ook over de keuzes die mensen maken.";
        } else {
            story.textContent +=
                " Je hebt het Orakel bereikt. Misschien ontdek je bij een volgende poging nog meer over Delphi en zijn geschiedenis.";
        }

        hint.textContent =
            "Einde van het spel! Vernieuw de pagina om opnieuw te spelen.";
    }

    draw();
}

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
        .includes(key)
    ) {
        event.preventDefault();
    }

    if (key === "arrowup" || key === "w") move(0, -1);
    if (key === "arrowdown" || key === "s") move(0, 1);
    if (key === "arrowleft" || key === "a") move(-1, 0);
    if (key === "arrowright" || key === "d") move(1, 0);
    if (key === "e") interact();
});

// Begintekst
showMessage(
    "De reis begint",
    "Je bent aangekomen in Delphi. Gebruik de pijltjestoetsen of WASD om te bewegen. Druk op E bij een geel blokje om een plek te onderzoeken."
);

hint.textContent =
    "Verken de kaart en ontdek de geschiedenis van Delphi.";

draw();
