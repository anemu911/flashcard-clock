function getTranslated() {
  var word = document.getElementsByClassName('tlid-source-text-input')[0].value
  var translatedWord = document.getElementsByClassName('tlid-translation')[0].innerText
  console.log(word,translatedWord)
  return  [word, translatedWord]
}

getTranslated()
