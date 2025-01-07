export {}; // Makes this file a module

export async function addContentContainerClickEvents() {
  const contentContainer = document.querySelector(".content-container");

  if (contentContainer) {
    // Check if contentContainer is not null before adding event listener
    contentContainer.addEventListener("click", () => {
      const menu = document.querySelector<HTMLDivElement>(".menu-sidebar");

      if (menu) {
        // Check if menu is not null before accessing its style
        if (menu.style.display === "flex") {
          menu.style.display = "none";
        }
      } else {
        console.error("Menu element not found!");
      }
    });
    contentContainer.addEventListener("click", () => {
      console.log("HERE!");
      const toggler = document.getElementById("toggle-chat-list-wrapper") as HTMLDivElement;
      toggler.style.display = 'flex';

      const panel = document.querySelector('.chat-list-panel') as HTMLDivElement;
      panel.style.display = 'none';

    })
  } else {
    console.error("Content container element not found!");
  }
}
