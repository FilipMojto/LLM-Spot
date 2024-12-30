export {};

// Function to fetch models and populate the select widget
async function fetchAndPopulateModels(service: string): Promise<void> {
    try {
        // Fetch models from the server
        const response = await fetch(`http://127.0.0.1:5000/models/${service}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        // Parse the JSON response
        const models: string[] = await response.json();

        // Get the select widget
        const selectWidget = document.getElementById('model') as HTMLSelectElement;
        if (!selectWidget) {
            throw new Error("Select widget with ID 'model' not found.");
        }

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

// Get the service select widget
const serviceWidget = document.getElementById('service-select-widget') as HTMLSelectElement;
if (!serviceWidget) {
    throw new Error("Select widget with ID 'service-select-widget' not found.");
}

// Use the 'change' event to detect when the user selects a new option
serviceWidget.addEventListener("change", async () => {
    const selectedService = serviceWidget.options[serviceWidget.selectedIndex]?.text.toLowerCase();
    if (selectedService) {
        await fetchAndPopulateModels(selectedService);
    } else {
        console.error("No service selected.");
    }
});