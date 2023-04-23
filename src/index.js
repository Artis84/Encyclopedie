// Define the path to your JSON file

// const jsonPath = "http://localhost:5001/encyclopedie-a9303/europe-west1/app/data";
const jsonPath = "https://europe-west1-encyclopedie-a9303.cloudfunctions.net/app/data";

window.onload = function () {
    document.getElementById("search-input").focus();
};

// Fetch the JSON data
const getJsonData = async () => {
    const response = await fetch(jsonPath);
    const data = await response.json();
    return data;
};

// Search function
const search = (data, keyword) => {
    const results = data.filter((item) => item.title.toLowerCase().includes(keyword.toLowerCase()) || item.content.toLowerCase().includes(keyword.toLowerCase()));
    return results;
};

const displayError = (err) => {
    const error = document.getElementById("error");
    error.style.display = "block";
    error.innerHTML = "";
    error.innerHTML = `<p>❌Error: ${err.message}</p>`;
    setTimeout(() => {
        error.style.display = "none";
    }, 5000);
};

// Display results
const displayResults = (results) => {
    const resultsDiv = document.getElementById("results");
    document.getElementById("spinner").style.display = "block";
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = "";
    let ResultsCardsCreated = 0;
    if (results.length > 0) {
        const fragment = document.createDocumentFragment(); // create Document Fragment
        results.forEach(async (result) => {
            // Replace FFZ emote codes with emote images
            const contentWithFFZEmotes = await replaceEmoteCodesWithImages(result.content, "https://api.frankerfacez.com/v1/emote/");

            const resultDiv = document.createElement("div");
            resultDiv.innerHTML = `
            <div class="cart">
                <div class="title"><p><strong>${result.title}</strong></p></div>
                <div class="content">
                <button class="copyButton">Copy</button>
                    <p id="textContent">${contentWithFFZEmotes}</p>
                </div>
            </div>
            `;

            const copyButton = resultDiv.querySelector(".copyButton");
            if (copyButton) {
                copyButton.addEventListener("click", () => {
                    const range = document.createRange();
                    range.selectNode(resultDiv.querySelector("#textContent"));
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand("copy");
                    setTimeout(() => {
                        window.getSelection().removeAllRanges();
                    }, 250);
                });
            }
            fragment.appendChild(resultDiv); // append resultDiv to fragment
            ResultsCardsCreated++;
            if (ResultsCardsCreated === results.length) {
                // Hide spinner when all the resultDiv elements have been created and appended to the fragment
                document.getElementById("spinner").style.display = "none";
                resultsDiv.appendChild(fragment); // append fragment to resultsDiv
            }
        });
    } else {
        resultsDiv.innerHTML = "<p>No results found</p>";
        document.getElementById("spinner").style.display = "none"; // Hide spinner when no results found
    }
};

// Helper function to replace emote codes with images using a third-party API
const replaceEmoteCodesWithImages = async (content, apiUrl) => {
    const emoteRegex = /:([\w\d]+):/g;
    const emoteCodes = content.match(emoteRegex) || [];
    if (!emoteCodes.length) console.error("No emotes found");
    for (const emoteCode of emoteCodes) {
        const emoteId = emoteCode.slice(1, -1);
        const fetchUrl = `${apiUrl + emoteId}`;
        const response = await fetch(fetchUrl);
        const data = await response.json();
        if (data && "animated" in data.emote) {
            content = content.replace(emoteCode, `<img src="https://cdn.frankerfacez.com/emote/${data.emote.id}/animated/1" alt="${data.emote.name}" title="${data.emote.name}">`);
        } else {
            content = content.replace(emoteCode, `<img src="https://cdn.frankerfacez.com/emote/${data.emote.id}/1" alt="${data.emote.name}" title="${data.emote.name}">`);
        }
    }
    return content;
};

// Initiate search on button click
const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", async () => {
    try {
        const keyword = document.getElementById("search-input").value;
        if (keyword.length == 0) throw new Error("La boite de saisie est vide");
        const data = await getJsonData();
        const results = search(data, keyword);
        displayResults(results);
    } catch (error) {
        displayError(error);
    }
});

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", async (event) => {
    try {
        if (event.keyCode === 13) {
            const keyword = searchInput.value;
            if (keyword.length == 0) throw new Error("La boite de saisie est vide");
            const data = await getJsonData();
            const results = search(data, keyword);
            displayResults(results);
        }
    } catch (error) {
        displayError(error);
    }
});
