self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

// Notificações
self.addEventListener('message', event => {
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const task = event.data.task;
    self.registration.showNotification(`Tarefa: ${task.title}`, {
      body: task.desc || 'Hora da tarefa!',
      tag: 'task-' + task.id,
      icon: './icon-192.png',
      data: { taskId: task.id }
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        if (clients.length > 0) {
          clients[0].focus();
        }
      })
  );
});
