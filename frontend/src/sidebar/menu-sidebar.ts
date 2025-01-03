export {};

const icon = document.querySelector<HTMLImageElement>('header > .account-icon');

if (icon){
	icon.addEventListener( 'click', () => {
		const menu = document.querySelector<HTMLDivElement>('.menu-sidebar');
		if (menu){
			menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
			console.log(menu.style.display);
		}
	});
}


