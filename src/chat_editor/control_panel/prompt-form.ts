export{};

document.addEventListener("DOMContentLoaded", async () => {
	const response = await fetch("http://127.0.0.1:5000/context", {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	// Assuming the JSON response has a specific structure, define an interface
	interface ContextResponse {
		context: string;  // replace with actual property name
	}

	const result: ContextResponse = await response.json();
	console.log(result.context);  // access the specific property
	const input = document.querySelector("#prompt-form  #prompt-context-input") as HTMLInputElement;

	// input.value = result.context;
	input.placeholder = result.context;
});