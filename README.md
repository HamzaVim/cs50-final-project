# CS50 Final Project - Dictionary extension
#### Video Link:  <URL HERE>
#### Selecting (highlighting) a word on any website, will give a definition, and also a phonetic, identification, and an example.
#### It can also be saved as a bookmark.

>The language I used:
- HTML
- Css
- JavaScript
#
## Resources:
- I learned [JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/) from the freeCodeCamp site.
- DOM manipulation from [JavaScript Tutorial for Beginners - Full Course in 12 Hours (2022)
](https://www.youtube.com/watch?v=lI1ae4REbFM&t=434s) Clever Programmer channel.
- From freeCodeCamp.org as well [Build a Chrome Extension – Course for Beginners](https://www.youtube.com/watch?v=0n809nd4Zu4).
- To gain a better understanding [Google Chrome Extensions: How to build an extension](https://www.youtube.com/watch?v=e3McMaHvlBY&t=1s).
- [Extensions Documentation](https://developer.chrome.com/docs/extensions/) from Chrome Developers.
- [](https://dictionaryapi.dev/)
- Icons from [icons8](https://icons8.com/).

## How does the extension work?

**manifest.json** gives the browser information about the extension, such as the most important files and the capabilities the extension might use.<br>

**contentScript.js** are JavaScript files that run in the context of web pages.<br>
By using the standard Document Object Model (DOM), they can read details of the web pages the browser visits, make changes to them, and pass information to their parent extension There are four functions in it:

- **getSelectedText**: this function detect five thing:

  1. to detect if it selected text not a space or just a click if that happens nothing will do.

  2. to detect if the text has numbers or spaces(like selecting two words) or another character I use regular expression [`\d\s,\(\)\{\}\[\]\.#@!$%^&*`]

  3. to detect if the box is already inside the document.

  4. to detect the mouse position:
      - if the mouse click inside the box element nothing will happen, if it's outside the box element the box will be removed.

  5. to detect if the error element exists if the mouse clicks inside or outside it will be removed.


  after that, it will create elements and add values, and classes to them and put in inside a box element, and inject the document with a box element.<br>
  or error element (if there is no definition) and inject the document, after 2 seconds it will remove.
<br>
  The box or error element will be placed under the selected part.

- **getDictionary**: this function is to send a request to the API dictionary if the response status is (200)***ok*** it will return an object with a word, identification, phonetic, definition, and an example.<br>
but if the response status is not (200) it will return the response title from the API.<br>
and give it to `getSelectedText()` function.

- **getBookmarks**: this function is to get from chrome storage all the words that are bookmarked or an empty array if they're not, and return them.

- **addToBookmarks**: if the user clicks the plus button, it will use the `getBookmarks()` function and save it in the `bookmarks` variable and it will be saved inside chrome storage.<br>
if the length of the variable `bookmarks` is 0 that means the user didn't save any words and it will be saved.<br>
if the length is more than 0 then it will be checked by the filter function on the `bookmarks` variable if the word exists inside the storage if it's there it will do nothing.<br>
if it's not inside it will add to it.

**contentScript.css** is for styling ***contentScript.js*** elements.<br>
**popup** refers to the main page users see when using an extension.<br>
It consists of two files: ***Popup.html*** and ***Popup.js***.<br>
**popup.css** is for styling ***popup.js*** elements that are inside ***popup.html***.<br>

**Popup.js** used seven functions when the user clicks the extension the [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event):

- **getBookmarks**: this function is like `getBookmarks()` function in ***contentScript.js*** above and it will be saved in `allBookmarks` global variable.

- **createContainer**: this function, will be sure that the container exists inside the HTML file and will return the link of the container.<br>
if it's not it will create it and return the same.

- **createElements**: it will create elements, values, and add a delete button inside the box element and it will inject the container element.

- **checkBookmarks**: to check the user's bookmarks length if it's 0 (no words in bookmark) it will use the `createContainer()` function and inject the container with the text _"There are no bookmarks to show"_.<br>
else it will send the bookmarks to the `viewBookmarks()` function.<br>
and it's used to refresh the page.

- **viewBookmarks**: the function will loop over the bookmark and use `createElements()` function.

- **setBookmarks**: it will set new bookmarks inside chrome storage, which means that it will remove the old bookmarks.

- **onDelete**: when the user clicks the delete button the function will start and it will filter the bookmarks, that means that it will delete the word from `allBookmarks` variable and use `setBookmarks()` to it, which means it will set the new bookmarks after deleting it and remove the container, and use `checkBookmarks()` function as a refresh to the page.
## How to use the extension
I'd like to upload it to the Chrome Web Store, but I simply cannot afford it so :relaxed:<br>
You can download it from GitHub; after that, open Google Chrome.<br>At the top right, click Extensions and click ***Manage extension***, and then activate ***Developer mode***, and then click ***Load unpacked***, and select the extension file.
#
### I wanted to thank [Grammarly](https://app.grammarly.com/) for fixing my English grammar.
### In the end, I enjoyed this experience of learning programming and problem-solving from **HarvardX**, so thank you very much and thank you Dr.**David J. Malan**.
