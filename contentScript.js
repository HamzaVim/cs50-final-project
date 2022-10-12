(() => {
  let xBefore = 0;
  let yBefore = 0;
  let bookmarks = []
  const getDictionary = async (word) => {
    const getR = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    })
    const response = await getR.json()
    if (getR.ok) {
        return {
            word: response[0]?.word || "No word",
            partOfSpeech: response[0].meanings[0]?.partOfSpeech || "No identification",
            phonetic: response[0]?.phonetics[0]?.text || "No phonetic",
            definition: response[0].meanings[0].definitions[0]?.definition || "No definition",
            example: response[0].meanings[0].definitions[0]?.example || "No example"
            }
        } 
    return {error: response.title}
  }
  const getBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get("DictionaryEx", (obj) => {
        resolve(obj['DictionaryEx'] ? JSON.parse(obj['DictionaryEx']): [])
      })
    })
  }
  const addToBookmarks = async (wordDictionary) => {
    bookmarks = await getBookmarks()
    if (!bookmarks.length) {
      chrome.storage.sync.set({DictionaryEx: JSON.stringify([wordDictionary])});
    } else {
      let s = bookmarks.filter(b => b.word !== wordDictionary.word)
      if (s.length == bookmarks.length) {
        chrome.storage.sync.set({DictionaryEx: JSON.stringify([wordDictionary, ...bookmarks])});
      } else {
        return 
      }
    }
  }
  const getSelectedText = async (event) => {
    const theBox = document.querySelector(".dictionaryEx-box");
    const error = document.querySelector(".dictionaryEx-error");
    if (!window.getSelection().rangeCount) {
      return 1;
    }
    const s = window.getSelection().getRangeAt(0).getBoundingClientRect()
    const x = s.left
    const y = event.pageY + s.height
    const mouseX = event.pageX

    if (error) {
      error.remove()
    }

    if (theBox) {
      const containerWidth = Number(getComputedStyle(theBox).width.slice(0, -2))
      const containerHieght = Number(getComputedStyle(theBox).height.slice(0, -2))
      if (mouseX >= xBefore && mouseX <= (xBefore + containerWidth) && y >= yBefore && y <= (yBefore + containerHieght)) {
        return 0
      }
      theBox.remove();
    }
    if (window.getSelection() && window.getSelection().toString() != " " && window.getSelection().toString() != "") {
      selectedText = window.getSelection().toString().trim();
      const Regex = /[\d\s,\(\)\{\}\[\]\.#@!$%^&*]/;
      if (Regex.test(selectedText)) {
        return 1
      }
      const dictionary = await getDictionary(selectedText)

      // -------------------------------------------

      if (dictionary.error) {
        const body = document.querySelector("body");
        const h4 = document.createElement("h3");


        h4.innerText = `Sorry No Definition Found`
        h4.className = "dictionaryEx-error"
        h4.style.fontSize = "small"


        body.appendChild(h4)
        const xx = Number(getComputedStyle(h4).width.slice(0, -2))
        const yy = Number(getComputedStyle(h4).height.slice(0, -2))
        if ((xx + x) >= window.innerWidth) {
          h4.style.left = `${x - xx + (xx / 2)}px`
        } else {
          h4.style.left = `${x}px`
        }
        h4.style.top = `${y}px`
        setTimeout(() => {
          if (!document.querySelector(".dictionaryEx-error")) {
            return 0
          }
          document.querySelector(".dictionaryEx-error").remove()
        },2000)
      } else {
        xBefore = x
        yBefore = y
        // ----------creating elements----------
        const body = document.querySelector("body");
        const box = document.createElement("div");


        const word = document.createElement("div");
        const h3 = document.createElement("h3");
        const plusBtn = document.createElement("button");
        const imgPlus = document.createElement("img");

        const details = document.createElement("div");
        const pos = document.createElement("p");
        const phonetic = document.createElement("p");

        const wordMeaning = document.createElement("p");
        const wordExample = document.createElement("p");
        // -------------------------------------
        // adding css classes and values
        
        imgPlus.src = "https://img.icons8.com/ios/40/000000/plus--v1.png"
        imgPlus.alt = "Add"
        plusBtn.title = "Add to Bookmarks"
        
        h3.innerText = dictionary.word
        pos.innerText = dictionary.partOfSpeech
        phonetic.innerText = dictionary.phonetic
        wordMeaning.innerText = dictionary.definition
        wordExample.innerText = dictionary.example

        box.className = "dictionaryEx-box"
        word.className = "dictionaryEx-word"
        details.className = "dictionaryEx-details"
        wordMeaning.className = "dictionaryEx-word-meaning"
        wordExample.className = "dictionaryEx-word-example"

        wordExample.style.fontSize = "medium"
        wordMeaning.style.fontSize = "medium"
        pos.style.fontSize = "medium"
        phonetic.style.fontSize = "medium"

        plusBtn.addEventListener("click", () => {
          addToBookmarks(dictionary)
        })

        // ----------appendChild----------
        plusBtn.appendChild(imgPlus)
        word.appendChild(h3)
        word.appendChild(plusBtn)

        details.appendChild(pos)
        details.appendChild(phonetic)

        box.appendChild(word)
        box.appendChild(details)
        box.appendChild(wordMeaning)
        box.appendChild(wordExample)

        body.appendChild(box)
        const xx = Number(getComputedStyle(box).width.slice(0, -2))
        const yy = Number(getComputedStyle(box).height.slice(0, -2))
        if ((xx + x) >= window.innerWidth) {
          box.style.left = `${x - xx + (xx / 2)}px`
        } else {
          box.style.left = `${x}px`
        }
        box.style.top = `${y}px`
        }
      }
  }
  document.addEventListener("mouseup", getSelectedText)
  
})();
