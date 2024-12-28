# LLM Spot

## How to install

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

### Releases

#### LLM Spot v0.1.0-beta.1

##### Installation

###### Requirements

1. **Node.js**
2. **npm** or other node package manager
3. **Python** compiler
4. **Pipenv** package manager

###### Steps

Clone the repository, navigate to *./backend* directory and execute>

	*pipenv install*

This will install all required Python packages. Then start the backend server:

	python ./api.py

In the root directory execute the following command:

	npm start

Now the website should start in the browser and you can use the application.

> To get full version history check *version_log.md* file.