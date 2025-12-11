if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setTimeout(() => {
              alert("资源已更新，即将刷新");
              $("#bt_stop").trigger("click");
              setTimeout(() => {
                window.location.reload(true);
              }, 3000);
            }, 1000);
          }
        });
      });
    });

  let isRefreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!isRefreshing) {
      isRefreshing = true;
      window.location.reload(true);
    }
  });
}