var slider = document.getElementById("temperature-slider");
var output = document.querySelector("#optional-tuning-params > #temperature-container > .row div:nth-of-type(2) > input");
output.value = (slider.value / 20).toFixed(2); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.value = (this.value / 20).toFixed(2);
}	