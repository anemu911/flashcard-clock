// Check user Authentication status
function startAuth(interactive) {
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      chrome.runtime.sendMessage({token: token}, function(response) {
        if (response.userAuthState.includes("Logged in as ")) {
          document.getElementById('signIn').innerText = response.userAuthState;
        }
        else if (response.userAuthState == "Not Existing User") {
          document.getElementById('signIn').innerText = 'Sign-in with Google';
        }
      })
    }
  })
}

window.onload = function() {
  startAuth(true)
}
