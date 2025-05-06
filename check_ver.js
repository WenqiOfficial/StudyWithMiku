$(function () {
    $.ajax({
      url: "https://api.hubproxy.wenqi.icu/repos/WenqiOfficial/StudyWithMiku/commits",
      type: "GET",
      success: function (data) {
        let latestSha = data[0].sha || "";
        let localSha = localStorage.getItem("version");
        if (!localSha) {
          localStorage.setItem("version", latestSha);
        } else if (localSha !== latestSha) {
          localStorage.setItem("version", latestSha);
          alert("即将刷新以获取新版本");
          location.reload(true);
        }
      }
    });
  });