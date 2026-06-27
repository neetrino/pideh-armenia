// Service Worker для кэширования и оптимизации производительности
const CACHE_NAME = 'pideh-armenia-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const API_CACHE = 'api-v1.0.0'

// Файлы для кэширования
const STATIC_FILES = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/manifest.json',
  '/favicon.ico'
]

// API endpoints для кэширования
const API_ENDPOINTS = [
  '/api/products',
  '/api/products/'
]

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Стратегия кэширования для статических файлов
  if (request.method === 'GET' && isStaticFile(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            console.log('Service Worker: Serving from cache:', url.pathname)
            return response
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
        })
    )
  }

  // Стратегия кэширования для API
  if (request.method === 'GET' && isAPIEndpoint(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            console.log('Service Worker: Serving API from cache:', url.pathname)
            return response
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(API_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
        })
    )
  }

  // Стратегия кэширования для изображений
  if (request.method === 'GET' && isImage(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            console.log('Service Worker: Serving image from cache:', url.pathname)
            return response
          }
          
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone()
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
        })
    )
  }
})

// Проверка статических файлов
function isStaticFile(pathname) {
  return STATIC_FILES.includes(pathname) || 
         pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/images/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.svg')
}

// Проверка API endpoints
function isAPIEndpoint(pathname) {
  return API_ENDPOINTS.some(endpoint => pathname.startsWith(endpoint))
}

// Проверка изображений
function isImage(pathname) {
  return pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)
}

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от Pideh Armenia',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Посмотреть',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/logo.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Pideh Armenia', options)
  )
})

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

console.log('Service Worker: Loaded successfully')
