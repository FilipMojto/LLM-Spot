export {}; // Makes this file a module

const contentContainer = document.querySelector('.content-container');

if (contentContainer) { // Check if contentContainer is not null before adding event listener
  contentContainer.addEventListener('click', () => {
    const menu = document.querySelector<HTMLDivElement>('.menu-sidebar');

    if (menu) { // Check if menu is not null before accessing its style
      if (menu.style.display === 'flex') {
        menu.style.display = 'none';
        console.log("HERE");
      }
    } else {
      console.error("Menu element not found!");
    }
  });
} else {
  console.error("Content container element not found!");
}