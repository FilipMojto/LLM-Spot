// document.getElementById("submit-icon").addEventListener("click", async (e) => {
//     e.preventDefault();

//     // Get the input values
//     const prompt = document.getElementById("prompt").value.trim();
//     const model = document.getElementById("model").value;

//     // Check if the prompt is empty
//     if (!prompt) {
//         alert("Please enter a prompt.");
//         return;
//     }

//     // Function to escape HTML characters
//     const escapeHtml = (str) => {
//         return str.replace(/[&<>"']/g, (match) => {
//             switch (match) {
//                 case '&': return '&amp;';
//                 case '<': return '&lt;';
//                 case '>': return '&gt;';
//                 case '"': return '&quot;';
//                 case "'": return '&#39;';
//                 default: return match;
//             }
//         });
//     };

//     const interpretSpecialChars = (str) => {
//         // Escape HTML characters
//         const escapeHtml = (s) => {
//             return s.replace(/[&<>"']/g, (match) => {
//                 switch (match) {
//                     case '&': return '&amp;';
//                     case '<': return '&lt;';
//                     case '>': return '&gt;';
//                     case '"': return '&quot;';
//                     case "'": return '&#39;';
//                     default: return match;
//                 }
//             });
//         };
    
//         // Escape the input first
//         const escapedStr = escapeHtml(str);
    
//         // Replace Markdown-style bold and italic syntax with HTML tags
//         let formattedStr = escapedStr
//             .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")  // Bold: **text**
//             .replace(/_(.+?)_/g, "<i>$1</i>");      // Italic: _text_
    
//         // Replace newlines (\n) and tabs (\t) with HTML equivalents
//         formattedStr = formattedStr
//             .replace(/\\n/g, "<br>")                 // Line break
//             .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"); // Tab space
    
//         return formattedStr;
//     };

//     try {
//         const chatPanel = document.querySelector(".chat-panel > div");

//         // Display the user's input in the chat panel
//         const userMessage = document.createElement("div");
//         userMessage.className = "container-fluid chat-item-left";
//         userMessage.innerHTML = `
//             <label class="message-text m-3">${interpretSpecialChars(prompt)}</label>
//         `;
//         chatPanel.appendChild(userMessage);

//         // Display a loading indicator for the response
//         const loadingMessage = document.createElement("div");
//         loadingMessage.className = "container-fluid chat-item-right";
//         loadingMessage.innerHTML = `
//             <label class="message-text m-3">Generating response...</label>
//         `;
//         chatPanel.appendChild(loadingMessage);

//         // Scroll to the bottom of the chat panel
//         chatPanel.scrollTop = chatPanel.scrollHeight;

//         // Send POST request to the server
//         const response = await fetch("/generate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ prompt, model }),
//         });

//         const result = await response.json();

//         // Update the loading message with the server's response
//         loadingMessage.querySelector(".message-text").innerHTML =
//             response.ok ? interpretSpecialChars(result.content) : `Error: ${result.error || "Unexpected error occurred."}`;

//         // Scroll to the bottom of the chat panel
//         chatPanel.scrollTop = chatPanel.scrollHeight;

//     } catch (error) {
//         // Handle network or other errors
//         alert(`Error: ${error.message}`);
//     } finally {
//         // Clear the input field
//         document.getElementById("prompt").value = "";
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-icon").addEventListener("click", async (e) => {
        marked.setOptions({
            sanitize: true, // Prevent raw HTML injection
            breaks: true,   // Convert newlines to <br>
            
        });

        e.preventDefault();

        // Get the prompt and preserve newlines and tabs
        const prompt = document.getElementById("prompt").value.trim();
        document.getElementById("prompt").value = "";

        


        if (!prompt) {
            alert("Please enter a prompt.");
            return;
        }

        const interpretSpecialChars = (str) => {
            // Escape HTML characters
            const escapeHtml = (s) => {
                return s.replace(/[&<>"']/g, (match) => {
                    switch (match) {
                        case '&': return '&amp;';
                        case '<': return '&lt;';
                        case '>': return '&gt;';
                        case '"': return '&quot;';
                        case "'": return '&#39;';
                        default: return match;
                    }
                });
            };
        
            // Escape the input first
            const escapedStr = escapeHtml(str);
        
            // Replace newlines (\n) and tabs (\t) with HTML equivalents
            const formattedStr = escapedStr
                .replace(/\\n/g, "<br>")                 // Line break
                .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"); // Tab space
        
            return formattedStr;
        };
            
        try {
            const chatPanel = document.querySelector(".chat-panel");
            chatPanel.removeChild(chatPanel.querySelector(':scope > label'));


            // Display the user's input
            const userMessage = document.createElement("div");
            userMessage.className = "container-fluid chat-item-left";
            
            
            userMessage.innerHTML = marked.parse(prompt);
            // userMessage.innerHTML = interpretSpecialChars(prompt);
            userMessage.innerHTML = userMessage.innerHTML.replace(/\\n/g, "<br>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
            
            // userMessage.style.display = 'flex';
            // userMessage.style.flexDirection = 'column';
            // userMessage.style.justifyContent = 'center'; // Vertical centering
            // userMessage.style.margin = 0;
            


            chatPanel.appendChild(userMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;

            // Display a loading indicator
            const loadingMessage = document.createElement("div");
            loadingMessage.className = "container-fluid chat-item-right";
            loadingMessage.innerHTML = 'Generating response...'
            // loadingMessage.innerHTML = `
            //     <label class="message-text m-3">Generating response...</label>
            // `;
            chatPanel.appendChild(loadingMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;

            const response = await fetch("/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const result = await response.json();

            // Update the response with formatted HTML
            loadingMessage.innerHTML = marked.parseInline(result.content.trim());
            console.log(loadingMessage.innerHTML)
            
            // .replace(/<\/?p>/g, ''); // Removes <p> tags;

            loadingMessage.innerHTML = loadingMessage.innerHTML.replace(/\\n/g, "<br>").replace(/\n/g, "<br>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"); // Tab space
            
            console.log(loadingMessage.innerHTML);

            loadingMessage.innerHTML = marked.parseInline(loadingMessage.innerHTML).replace(/<br>\s*(<p)/g, '$1');

            console.log(loadingMessage.innerHTML);
            // loadingMessage.innerHTML = interpretSpecialChars(result.content);

            chatPanel.scrollTop = chatPanel.scrollHeight;
            
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            // Clear the input field
            document.getElementById("prompt").value = "";
        }
    });
});