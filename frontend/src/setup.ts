import { fetchAndPopulateServices } from "./chat_editor/control_panel/service-loader";
import { fetchAndPopulateModels } from "./chat_editor/control_panel/model-loader";


document.addEventListener("DOMContentLoaded", async() => {
	await fetchAndPopulateServices()
	const serviceWidget = document.getElementById('service-select-widget') as HTMLSelectElement;

	await fetchAndPopulateModels(serviceWidget.options[serviceWidget.selectedIndex].value);
})