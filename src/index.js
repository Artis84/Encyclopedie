// Define the path to your JSON file

// const jsonPath = "http://localhost:5001/encyclopedie-a9303/europe-west1/app/data";
const jsonPath = "https://europe-west1-encyclopedie-a9303.cloudfunctions.net/app/data";

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
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = "";
    if (results.length > 0) {
        results.forEach((result) => {
            const resultDiv = document.createElement("div");
            resultDiv.innerHTML = `
            <div class="cart">
                <div class="title"><p><strong>${result.title}</strong></p></div>
                <div class="content">
                <button class="copyButton" onclick="copyContent('${result.content}')">Copy</button>
                    <p>${result.content}</p>
                </div>
            </div>
            `;
            resultsDiv.appendChild(resultDiv);
        });
    } else {
        resultsDiv.innerHTML = "<p>No results found</p>";
    }
};

const copyContent = (content) => {
    console.log(content);
    navigator.clipboard.writeText(content);
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
