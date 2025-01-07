export async function bindTemperatureInputToSlider(){
  const slider = document.getElementById("temperature-slider-wrapper") as HTMLInputElement;
  const output = document.querySelector<HTMLInputElement>("#temperature-input");

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
}