const form = document.getElementById("form");
const status = document.getElementById("status");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from submitting

    const formData = new FormData(event.target); // Get form data
    const data = Object.fromEntries(formData.entries()); // Convert FormData to object

    // const jsonPath = "http://localhost:5001/encyclopedie-a9303/europe-west1/app/submit-form";
    const jsonPath = "https://europe-west1-encyclopedie-a9303.cloudfunctions.net/app/submit-form";
    // Send POST request to server to save data
    const headers = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    };
    fetch(jsonPath, headers)
        .then((response) => response.json())
        .then((result) => {
            status.style.display = "block";
            status.innerHTML = "<p>✔ Data saved successfully</p>";
            setTimeout(() => {
                status.style.display = "none";
            }, 5000);
        })
        .catch((error) => {
            status.style.display = "block";
            status.innerHTML = `<p>❌Error: ${error.message}</p>`;
            setTimeout(() => {
                status.style.display = "none";
            }, 5000);
        });
});
