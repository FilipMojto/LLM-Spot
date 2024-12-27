# LLM Spot v0.1.0-beta.1

## Installation

### Development
The application will be containerized using Docker, which starts both web and app servers locally.

### Production
After successful testing of the development release, the first production release will be deployed.

## External Dependencies

### Frontend
1. **Snowpack**: Frontend development and TypeScript integration
2. **Marked**: Parses LLM's markdown into HTML

### Backend
1. **Flask**: Deploys the backend server and its endpoints
2. **Flask-CORS**: Allows the Flask server to handle requests from the web server
3. **python-dotenv**: Loads environment variables into Python code
4. **OpenAI**: Communicates with OpenAI's public API
5. **Requests**: Sends requests to API servers

## Development Status

### Implemented Features
- [x] Core chat functionality
- [x] Basic API integration
- [x] Markdown support
- [x] File attachment support
- [x] Conversation context

### Planned Features
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

