// Function to fetch models and populate the select widget
async function fetchAndPopulateModels(service) {
    try {
        // Fetch models from the server
        const response = await fetch(`/models/${service}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        // Parse the JSON response
        const models = await response.json();

        // Get the select widget
        const selectWidget = document.getElementById('model');

        // Clear existing options
        selectWidget.innerHTML = '';

        // Populate new options
        models.forEach((model) => {
            const newOption = document.createElement('option');
            newOption.value = model;
            newOption.textContent = model;
            selectWidget.appendChild(newOption);
        });

    } catch (error) {
        console.error("Error populating models:", error);
    }
}

const serviceWidget = document.getElementById('service-select-widget');

// Use the 'change' event to detect when the user selects a new option
serviceWidget.addEventListener("change", async (e) => {
    const selectedService = serviceWidget.options[serviceWidget.selectedIndex].text.toLowerCase();
    fetchAndPopulateModels(selectedService);
});
