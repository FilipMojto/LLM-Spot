export {};

const slider = document.getElementById("temperature-slider") as HTMLInputElement;
const output = document.querySelector<HTMLInputElement>("#optional-tuning-params #temperature-container .row div:nth-of-type(2) input");

if (slider && output) {
  // Convert slider value to a number and update output
  const updateOutput = () => {
    output.value = (parseFloat(slider.value) / 20).toFixed(2);
  };

  // Initialize output with default slider value
  updateOutput();

  // Update output when slider value changes
  slider.oninput = updateOutput;
}