// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAovNFTfe1jvDaLqtLkiB8JB1L36s7WthE',
  authDomain: 'flashcard-0802.firebaseapp.com',
  projectId: 'flashcard-0802'
};
firebase.initializeApp(config);
var db = firebase.firestore()
var user = firebase.auth().currentUser

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  var credential = firebase.auth.GoogleAuthProvider.credential(null,message.token)
  firebase.auth().signInWithCredential(credential).then(function (userCredential) {
    sendResponse({userAuthState: 'Logged in as '+userCredential.user.email})
    // Check if userCredential is a document in users
    var userDocRef = db.collection("users").doc(userCredential.user.uid)
    userDocRef.get().then(function (docSnapshot) {
      if (docSnapshot.exists) {}
      else {userDocRef.set({
        email : userCredential.user.email,
        words : []
      })}
    })
  }).catch(function (error) {
    sendResponse({userAuthState: 'Not Existing User'})
  })
  return true
})


chrome.alarms.onAlarm.addListener(function(alarm) {
  var user = firebase.auth().currentUser
  if (user) {
    db.collection("users").doc(user.uid).get().then(function(results) {
        var words = results.data().words
        var randomWord = words[Math.floor(Math.random() * words.length)];
        // chrome.runtime.sendMessage({title: "Word of the day: " + randomWord.word, subtitle: "Meaning: " + randomWord.translatedWord}, function(response) {}))

        chrome.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {title: "Word of the day: " + randomWord.word, subtitle: "Meaning: " + randomWord.translatedWord});
        });
      });
  }
  else {}

})

// Add context menu upon installment
function onClickHandler(info, tab) {
  var user = firebase.auth().currentUser
  tabId = tab.id
  if (user && tab.url.includes('translate.google.com')) {
    chrome.tabs.executeScript(tabId, {file: 'getTranslated.js', allFrames: false},
        function(results) {
          var updateResult = results[0]
          db.collection("users").doc(user.uid).update({
            words: firebase.firestore.FieldValue.arrayUnion({word: updateResult[0],translatedWord: updateResult[1]})
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        }
    )
  }
  else {}
}
chrome.contextMenus.onClicked.addListener(onClickHandler)

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    "title": "[+] Flash card",
    "contexts": ["selection"],
    "documentUrlPatterns": ["*://translate.google.com/*"],
    "id": "FlashCard"
  })
})
