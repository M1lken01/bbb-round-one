(document.querySelector(`a[href="${window.location.pathname.split('/').pop()}"]`) as HTMLElement).classList.add('underline');
let darkmode = localStorage.getItem('darkmode') === '1';
if (!darkmode) localStorage.setItem('darkmode', '0');
loadDarkmode();

function toggleDarkmode(): void {
  darkmode = !darkmode;
  localStorage.setItem('darkmode', darkmode ? '1' : '0');
  document.querySelector('body')!.classList.remove('darkmode');
  loadDarkmode();
}

function loadDarkmode(): void {
  if (darkmode) document.querySelector('body')!.classList.add('darkmode');
  (document.querySelector('footer img') as HTMLImageElement).src = `./imgs/${darkmode ? 'sun' : 'moon'}.png`;
}
