

export async function fetchAndPopulateServices() {
	try {
        // Fetch models from the server
        const response = await fetch(`http://127.0.0.1:5000/services`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        // Parse the JSON response
        const services: string[] = await response.json();
        console.log("received services: ", services);

        // Get the select widget
        const selectWidget = document.getElementById('service-select-widget') as HTMLSelectElement;
        if (!selectWidget) {
            throw new Error("Select widget with ID 'service-select-widget' not found.");
        }

        // Clear existing options
        selectWidget.innerHTML = '';

        // Populate new options
        services.forEach((service) => {
            const newOption = document.createElement('option');
	
            newOption.value = service.replace(/Wrapper$/, '');
            newOption.textContent = service.replace(/Wrapper$/, '');
            selectWidget.appendChild(newOption);
        });

    } catch (error) {
        console.error("Error populating services:", error);
    }
}