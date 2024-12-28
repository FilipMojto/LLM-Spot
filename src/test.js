"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marked_1 = require("marked");
var renderer = new marked_1.marked.Renderer();
renderer.code = function (_a) {
    var text = _a.text, lang = _a.lang, escaped = _a.escaped;
    var language = lang || 'plaintext';
    return "<pre><code class=\"language-".concat(language, "\">").concat(text, "</code></pre>");
};
marked_1.marked.setOptions({
    renderer: renderer,
    breaks: false, // Convert newlines to <br>
});
// const parsedContent = marked.parse(result.content.trim().replace(/```.*?\n/g, '').replace(/```/g, ''));
var input = "```python\n# Define a function to calculate the exponential of a number\ndef calculate_exponential(base, exponent):\n    result = base ** exponent\n    return result\n\n# Call the function and print the result\nbase_num = 2\nexponent_num = 3\nexp_result = calculate_exponential(base_num, exponent_num)\nprint(f'The exponential of {base_num} raised to the power of {exponent_num} is: {exp_result}')\n```\n\nThis Python code defines a function called `calculate_exponential` that computes the exponential of a base number raised to an exponent. The function takes two arguments, `base` and `exponent`, and calculates the result by raising the base to the power of the exponent.\n\nIn the example, the function is called with `base_num = 2` and `exponent_num = 3`, which calculates 2 raised to the power of 3, resulting in 8. The output will display \"The exponential of 2 raised to the power of 3 is: 8\". \n\nIf you have any other specific Python code or descriptions you would like to generate, feel free to let me know!```  ";
var output = marked_1.marked.parse(input.trim());
console.log(output);
