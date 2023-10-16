const $versi = "v1.0";
const $caches = [
/*  '.','index.html','../0/wa.png','../0/3titik.png','../0/centang.png','../0/icon.png','../0/ss1.png','../0/ss2.png','../0/ss3.png','../0/script.js','../0/bootstrap5.2.3.min.css','../0/bootstrap5.2.3.bundle.min.js','../0/bootstrap.min.css.map','../0/bootstrap.bundle.min.js.map'
*/];

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open($versi).then(cache => {
			return cache.addAll($caches);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
		caches.keys().then(keys => {
		  return Promise.all(keys.filter(key => key !== $versi).map(key => caches.delete(key))
		  )
		})
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request).then(response => {
			return response || fetch(e.request);
		})
	);
});

