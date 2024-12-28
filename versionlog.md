


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

### Planned Features

- [ ] Splitting chatting into conversations
- [ ] Setting personal tokens by user	
- [ ] More keyboard shortcuts
- [ ] Processing image requests by LLM
- [ ] Support of multiple LLMs
- [ ] Better website responsiveness
- [ ] Error handling
- [ ] Basic documentation
- [ ] Installation guide
- [ ] Basic test coverage

### Known Issues