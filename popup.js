// TODO: Get from storage all Defenition the are saved
let allBookmarks = []
let book = []

const setBookmarks = (bookmarks) => {
  chrome.storage.sync.set({DictionaryEx: JSON.stringify([...bookmarks])});
}

const getBookmarks = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get("DictionaryEx", (obj) => {
      resolve(obj['DictionaryEx'] ? JSON.parse(obj['DictionaryEx']): []);
    })
  })
}

const checkBookmarks = (all) => {

  let body = document.querySelector("body")
  
  if (!all.length){
    
    let container = createContainer();
    
    let title = document.createElement("i")

    body.className = "";
    body.style.backgroundColor = "white"
    document.querySelector("h2").style.backgroundColor = "white"

    title.innerText = "There are no bookmarks to show";
    title.className = "title";

    container.appendChild(title)
  } else {
    
    viewBookmarks(all);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  allBookmarks = await getBookmarks();
  checkBookmarks(allBookmarks)
})

// TODO: represent It

const viewBookmarks = (allBookmarks) => {

  if (allBookmarks.length == 1) {
    createElements(allBookmarks[0])
    document.querySelector(".box").style.borderRadius = "0"
  } else {
    for (let bookmark in allBookmarks) {
      createElements(allBookmarks[bookmark]);
    }
  }
}

const createContainer = () => {
  let container = document.querySelector(".container");
  if (!container) {
    let container = document.createElement("div");
    container.className = "container";
    document.querySelector("body").appendChild(container);
    return container;
  }
  return container
}


const createElements = (bookmark) => {

  const body = document.querySelector("body");
  const container = createContainer()
  const box = document.createElement("div");


  const word = document.createElement("div");
  const h3 = document.createElement("h3");
  const deleteBtn = document.createElement("button");
  const imgDelete = document.createElement("img");

  const details = document.createElement("div");
  const pos = document.createElement("p");
  const phonetic = document.createElement("p");

  const wordMeaning = document.createElement("p");
  const wordExample = document.createElement("p");

  // ---------------------------------------------------- //
  // Adding values

  deleteBtn.addEventListener("click", () => {
    onDelete(bookmark)
    box.remove()
  })
  imgDelete.src = chrome.runtime.getURL("images/minus-icon.png")
  deleteBtn.title = "Delete"

  h3.innerText = bookmark.word
  pos.innerText = bookmark.partOfSpeech
  phonetic.innerText = bookmark.phonetic
  wordMeaning.innerText = bookmark.definition
  wordExample.innerText = bookmark.example



  // ---------------------------------------------------- //
  // Adding Attribute
  box.className = "box";

  word.className = "word";
  details.className = "details";
  wordMeaning.className = "word-meaning"
  wordExample.className = "word-example"

  // ---------------------------------------------------- //

  deleteBtn.appendChild(imgDelete)

  word.appendChild(h3)
  word.appendChild(deleteBtn)

  details.appendChild(pos)
  details.appendChild(phonetic)

  box.appendChild(word)
  box.appendChild(details)
  box.appendChild(wordMeaning)
  box.appendChild(wordExample)
  container.appendChild(box)
}

// TODO: If it's Preesed it will be removed from storage

const onDelete = async (word) => {
  
  let bookmarksAfterEdit = allBookmarks.filter(b => b.word !== word.word)
  allBookmarks = bookmarksAfterEdit

  document.querySelector(".container").remove()

  setBookmarks(allBookmarks)
  checkBookmarks(allBookmarks)
}