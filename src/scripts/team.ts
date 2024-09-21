function updateClock(): void {
  const format = (time: number) => time.toString().padStart(2, '0');
  const now = new Date();
  document.getElementById('clock')!.textContent = `${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;
}
updateClock();
setInterval(updateClock, 1000);

function toggleBio(index: number): void {
  const bio = document.getElementById(`bio-${index}`)!;
  bio.hidden = !bio.hidden;
}

const images = ['600x400.png', '600x400.png', '600x400.png'];
let currentImageIndex = -1;

function showNextImage(): void {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  const imgElement = document.getElementById('extra-image') as HTMLImageElement;
  imgElement.src = `./imgs/${images[currentImageIndex]}`;
  imgElement.classList.remove('hidden');
}
