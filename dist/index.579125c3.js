// Define the path to your JSON file
const jsonPath = "data";
// Fetch the JSON data
const getJsonData = async ()=>{
    const response = await fetch(jsonPath);
    const data = await response.json();
    return data;
};
// Search function
const search = (data, keyword)=>{
    const results = data.filter((item)=>item.title.toLowerCase().includes(keyword.toLowerCase()) || item.content.toLowerCase().includes(keyword.toLowerCase()));
    return results;
};
// Display results
const displayResults = (results)=>{
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    if (results.length > 0) results.forEach((result)=>{
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `
                <p><strong>${result.title}</strong></p>
                <p>${result.content}</p>
            `;
        resultsDiv.appendChild(resultDiv);
    });
    else resultsDiv.innerHTML = "<p>No results found</p>";
};
// Initiate search on button click
const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", async ()=>{
    const keyword = document.getElementById("search-input").value;
    const data = await getJsonData();
    const results = search(data, keyword);
    displayResults(results);
});
// Initiate search on enter key press
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keyup", async (event)=>{
    if (event.keyCode === 13) {
        const keyword = searchInput.value;
        const data = await getJsonData();
        const results = search(data, keyword);
        displayResults(results);
    }
});

//# sourceMappingURL=index.579125c3.js.map
