


# LLM Spot v0.1.0-Pre-aplha

## Installation

### Requirements

1. **Node.js**
2. **npm** or other node package manager
3. **Python** compiler
4. **Pipenv** package manager

### Steps

Clone the repository, navigate to *./backend* directory and execute>

	*pipenv install*

This will install all required Python packages. Then start the backend server:

	python ./api.py

In the root directory execute the following command:

	npm start

Now the website should start in the browser and you can use the application.

## Development Status

### Implemented Features
- [x] Core chat functionality
- [x] Basic API integration
- [x] Markdown support
- [x] File attachment support
- [x] Conversation context

### Planned Features
- [ ] Parsing Code Blocks into Code HTML Element.
- [ ] Setting personal tokens by user
- [ ] Splitting chatting into conversations
- [ ] More keyboard shortcuts
- [ ] Processing image requests by LLM
- [ ] Support of multiple LLMs
- [ ] Better website responsiveness
- [ ] Error handling
- [ ] Basic documentation
- [ ] Installation guide
- [ ] Basic test coverage

### Known Issues
- Single conversation per browser session
- Conversation history lost on refresh
- Limited responsiveness on medium/small screens
- Code Blocks generated by an LLM are not parsed properly.
- Panel Action Bar doesnt have minimal height.

# LLM Spot v0.2.0-Pre-alpha

## Installation

### Requirements

1. **Node.js**
2. **npm** or other node package manager
3. **Python** compiler
4. **Pipenv** package manager

### Steps

Clone the repository, navigate to *./backend* directory and execute>

	*pipenv install*

This will install all required Python packages. Then start the backend server:

	python ./api.py

In the root directory execute the following command:

	npm start

Now the website should start in the browser and you can use the application.

## Development Status

### Implemented Features
- [x] Core chat functionality
- [x] Basic API integration
- [x] Markdown support
- [x] File attachment support
- [x] Loading and managing Conversation context
- [x] Parsing Code Blocks into Code HTML Element.
- [x] Highlighting Code Blocks special keywords' font and contrasting it properly.
- [x] Splitting chatting into conversations
- [x] Allow user to modify the context of the LLM.
- [x] Simple Keep-alive Mechanism between webpage and backend server.
- [x] Making Optional Tuning Parameters Container collapsible.

### Planned Features


- [ ] Setting personal tokens by user	
- [ ] More keyboard shortcuts
- [ ] Processing image requests by LLM
- [ ] Support of multiple LLMs
- [ ] Better website responsiveness
- [ ] Error handling
- [ ] Basic documentation
- [ ] Installation guide
- [ ] Basic test coverage

### Changelog
- User now can create more conversations per a session.
- Conversation history is stored locally on server, so refreshing the page won't erase it.
- Website is now more responsive on small/medium screens.
- Parser now successfully parses Code Blocks generated by an LLM into distinguisable html blocks.
- Keywords used in various Programming Languages are now properly highlighted.
- Panel Action bar now has a minimal height.

### Known Issues
- Still, responsiveness could be better. For smaller screens the total height of website should be smaller.
- Website should be more UX-designed (for instance when sending a request the submit button could its icon to indicate the llm processes the request, etc.)
- Font inside parsed code blocks is too bold.
- Account Settings are still useless.