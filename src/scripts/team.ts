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

const images = [
  'https://gyor-bolyai-alt.cms.intezmeny.edir.hu/uploads/bolyaiiskola_ec0f79270b.jpg',
  'https://cms.gyori.szc.edir.hu/uploads/081127_Bolyaitech_iskolaepulet_6b6dc9aab1.JPG',
  'https://gyor-bolyai-alt.cms.intezmeny.edir.hu/uploads/Screenshot_32_3dbb8b138a.png',
];
let currentImageIndex = -1;

function showNextImage(): void {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  const imgElement = document.getElementById('extra-image') as HTMLImageElement;
  imgElement.src = images[currentImageIndex];
  imgElement.classList.remove('hidden');
}
