chrome.runtime.onMessage.addListener(function(request, sender){
    swal({
      title: request.title,
      text: request.subtitle,
      icon: "info",
    });
});
