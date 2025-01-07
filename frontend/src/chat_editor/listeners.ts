

export async function addChatListTogglerEvent(){
	
	const toggler = document.getElementById("toggle-chat-list-wrapper") as HTMLDivElement;
	toggler.addEventListener("click", (event) => {
		event.stopPropagation();
		
		console.log("HERE TOO!");
		const chatListPanel = document.querySelector('.chat-list-panel') as HTMLDivElement;
		chatListPanel.style.display = 'flex';
		toggler.style.display = 'none';
	})
}

export async function addChatListPanelEvent() {
	const panel = document.querySelector('.chat-list-panel') as HTMLDivElement;
	panel.addEventListener("click", (event) => {
		console.log("HERE I AM!");
		event.stopPropagation();
	})
}