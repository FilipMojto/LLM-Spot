export { };

document.addEventListener("DOMContentLoaded", async () => {

	var coll = document.getElementsByClassName("collapsible");
	var i;

	for (i = 0; i < coll.length; i++) {
		const indicator = coll[i].querySelector('.state-text-indicator') as HTMLSpanElement;

		coll[i].addEventListener("click", function (this: HTMLElement) {
			this.classList.toggle("active");
			indicator.textContent = indicator.textContent === "+" ? "-" : "+";

			var content = this.nextElementSibling as HTMLElement;

			if (content.style.display === 'block' || content.style.display === "inline" || content.style.display === "grid" || content.style.display === "flex") {
				content.style.display = "none";
				console.log("none");
			} else {
				content.style.display = "flex";
				console.log("flex");
			}
		});
	}
});