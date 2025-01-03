# LLM Spot

## How to install
Check the *Installation* subsection in the newest app release.

## Development
The application will be containerized using Docker, which starts both web and app servers locally.

## Production
After successful testing of the development release, the first production release will be deployed.

### Backend

1. **flask** - Deploys the backend server and its endpoints.
2. **flask-cors** - Allows the Flask server to handle requests from the web server.
3. **python-dotenv** - Loads environment variables into Python code.
4. **openai** - Communicates with OpenAI's public API.
5. **requests** - Sends requests to API servers.


## LLM Spot v0.2.0-Pre-alpha

### Installation

#### Requirements
- Node.js
- npm (or another package manager)
- Python 3
- Pipenv

#### Steps
1. Clone the repository.
2. Navigate to `./backend` and run:
   ```bash
   pipenv install
   python ./api.py
   ```
3. In the root directory, start the frontend:
	```bash
	npm start
	```

### Development Status

#### Implemented Features

- Core chat functionality.
- Basic API integration.
- Markdown support.
- File attachment support.
- Conversation context management.
- Parsing and highlighting of code blocks.
- Support for multiple conversations per session.
- Persistent conversation history.

#### Planned Features

- User-configurable tokens.
- Enhanced keyboard shortcuts.
- Image processing by LLM.
- Support for multiple LLMs.
- Improved responsiveness and UX.
- Comprehensive error handling.
- Documentation and installation guide.
- Basic test coverage.
#### Changelog

##### Added

- Support for multiple conversations per session.
- Persistent conversation history stored on the server.
- Improved code block parsing and highlighting.

##### Improved

- Website responsiveness on smaller screens.
- Collapsible tuning parameters container.

##### Fixed

- Panel action bar now has a minimum height.

#### Known Issues

- Responsiveness can still be improved for very small screens.
- UX enhancements, such as better status indicators for requests.
- Font in parsed code blocks is too bold.
- Account settings remain non-functional.