const form = document.getElementById("form");
const status = document.getElementById("status");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form from submitting

    const formData = new FormData(event.target); // Get form data
    const data = Object.fromEntries(formData.entries()); // Convert FormData to object

    const jsonPath = "submit-form";
    // Send POST request to server to save data
    fetch(jsonPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            status.innerHTML = "<p>✔ Data saved successfully</p>";
            // location.href = "http://localhost:3000/submit-form";
        })
        .catch((error) => {
            status.innerHTML = `<p>❌Error: ${error.message}</p>`;
        });
});
