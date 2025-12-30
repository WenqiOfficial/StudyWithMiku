$(function () {
  const REPO_API = "https://api.hubproxy.wenqi.icu/repos/WenqiOfficial/StudyWithMiku/commits";

  async function nukeCacheAndReload() {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    location.reload(true);
  }

  function performUpdate(newSha) {
    localStorage.setItem("version", newSha);
    alert("即将刷新以获取新版本");
    nukeCacheAndReload();
  }

  function checkServerFile(filePath, commitDate, status) {
    return new Promise((resolve) => {
      $.ajax({
        url: "./" + filePath + "?v=" + Date.now(),
        type: "HEAD",
        success: function (res, statusText, xhr) {
          const lastModified = xhr.getResponseHeader("Last-Modified");
          if (lastModified) {
            const serverDate = new Date(lastModified);
            if (serverDate >= commitDate) {
              resolve(true);
            } else {
              console.log(`[CheckVer] Server file ${filePath} is old. Server: ${serverDate.toLocaleString()}, Commit: ${commitDate.toLocaleString()}`);
              resolve(false);
            }
          } else {
            console.log(`[CheckVer] No Last-Modified header for ${filePath}. Assuming ready.`);
            resolve(true);
          }
        },
        error: function () {
          if (status === 'added') {
            console.log(`[CheckVer] New file ${filePath} not found on server.`);
          } else {
            console.log(`[CheckVer] Error checking file ${filePath}.`);
          }
          resolve(false);
        }
      });
    });
  }

  async function checkVersion() {
    try {
      const data = await $.ajax({ url: REPO_API, type: "GET" });
      if (!data || !data.length) return;

      const latestSha = data[0].sha;
      const localSha = localStorage.getItem("version");

      if (!localSha) {
        localStorage.setItem("version", latestSha);
        return;
      }

      if (localSha === latestSha) return;

      console.log(`[CheckVer] Detected new version: ${latestSha}. Verifying server sync...`);

      const commitUrl = data[0].url.replace("https://api.github.com", "https://api.hubproxy.wenqi.icu");
      const commitData = await $.ajax({ url: commitUrl, type: "GET" });

      const changedFile = commitData.files.find(f => f.status === 'modified' || f.status === 'added');

      if (!changedFile) {
        console.log("[CheckVer] No verifiable file change found. Updating directly.");
        performUpdate(latestSha);
        return;
      }

      const commitDate = new Date(commitData.commit.committer.date);
      const isReady = await checkServerFile(changedFile.filename, commitDate, changedFile.status);

      if (isReady) {
        console.log("[CheckVer] Server is synced. Performing update.");
        performUpdate(latestSha);
      } else {
        console.log("[CheckVer] Server not yet synced. Waiting for next check.");
      }

    } catch (err) {
      console.error("[CheckVer] Error during version check:", err);
    }
  }

  checkVersion();
});