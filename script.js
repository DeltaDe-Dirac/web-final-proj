var linesArr;
var currLine;
var curLesson;

/**
 * Initialze variables
 */
function initialize_page() {
  // myStorage = window.sessionStorage;
  // linesArr = $("main").val().split("\n");
  linesArr = document.getElementById("main").innerHTML.split(" ");
  // myStorage["linesArr"] = linesArr;
  currLine = 0;
  curLesson = 1;
  // document.getElementById("main").innerHTML = "";
  if (supportsImports()) {
    console.log("link tag supports imports");
  } else {
    console.log("link tag DOES NOT support imports!");
  }
  loadLesson();
}

function talk() {
  // var msg = new SpeechSynthesisUtterance();
  // msg.text = document.getElementById("message").value;
  // if (msg.text) {
  //   // document.getElementById("message").value = "";
  //   window.speechSynthesis.speak(msg);
  // }

  string = document.getElementById("inputText").value;
  string = string.replace(/\s\s+|\n/g, "&nbsp;");

  document.getElementById("main").innerText = string;
  document.getElementById("inputText").style.display = "none";
  document.getElementById("main").style.display = "block";
}

function logMsg() {
  if (currLine < linesArr.length) {
    console.log(linesArr[currLine++]);
    // document.getElementById("main").innerHTML += linesArr[currLine++];
  } else {
    console.log("End of text");
  }
}

function loadLesson() {
  let lesName = "#les_" + curLesson++;
  console.log(lesName);

  $(document).ready(function () {
    $("#preload").load("data.html " + lesName);
  });

  // $(function () {
  //   var $button = $(".button").clone();
  //   $(".package").html($button);
  // });
}

function startLesson() {
  string = document.getElementById("preload").innerText;
  string = string.replace(/\s\s+|\n/g, " ");
  string = string.trim();

  let mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";
  mainDiv.focus();

  let i,
    word,
    spn,
    clsName = "_clean";

  word = document.createElement("SPAN");
  word.classList.add("_word");
  spn = document.createElement("SPAN");
  spn.classList.add("_clean");
  spn.classList.add("_focus");
  spn.innerText = string.charAt(0);
  word.appendChild(spn);
  // mainDiv.appendChild(word);

  for (i = 1; i < string.length; i++) {
    spn = document.createElement("SPAN");

    // if (i % 2 == 0) {
    //   clsName = "_correct";
    // } else if (i % 3 == 0) {
    //   clsName = "_error";
    // } else {
    //   clsName = "_fixed";
    // }

    spn.classList.add(clsName);

    // if (string.charAt(i) == " ") {
    //   spn.innerText = "&nbsp;";
    //   console.log("space");
    // } else {
    //   spn.innerText = string.charAt(i);
    // }

    spn.innerText = string.charAt(i);
    word.appendChild(spn);

    if (string.charAt(i) == " ") {
      mainDiv.appendChild(word);
      word = document.createElement("SPAN");
      word.classList.add("_word");
    }
  }
  mainDiv.appendChild(word);
  loadLesson();

  const example = document.getElementById("main");
  const range = document.createRange();
  range.setStart(example, 0);
  range.setEnd(example, range.commonAncestorContainer.childNodes.length);
  console.log(range);
  console.log(range.getBoundingClientRect());
  console.log(range.commonAncestorContainer.childNodes);
  console.log(range.commonAncestorContainer.childNodes[1]);
  console.log(range.toString());
  let rect = range.getClientRects();
  console.log(rect);
  let rectArr = [];
  for (i = 0; i < rect.length; ++i) {
    if (rect[i].width == 20) {
      rectArr.push(Math.floor(rect[i].bottom));
    }
  }
  console.log(rectArr);

  function getLineBreaksAndLog() {
    console.log(range.getClientRects());
  }
}

document.addEventListener("keydown", logKey);

function logKey(e) {
  let spnEl = document.getElementsByClassName("_focus")[0];
  let spanText = spnEl.innerHTML;
  console.log("span value|" + spanText + "|");

  if ((e.keyCode > 46 && e.keyCode < 91) || e.keyCode > 185 || e.keyCode == 32) {
    spnEl.classList.remove("_focus");
    spnEl.classList.remove("_clean");

    // if (e.keyCode == 32) {
    //   console.log("|" + e.key + "-" + spnEl.innerText + "|");
    // }

    if (e.key == spanText) {
      if (spnEl.classList.contains("_error")) {
        spnEl.classList.add("_fixed");
        spnEl.classList.remove("_error");
      } else if (!spnEl.classList.contains("_fixed") && !spnEl.classList.contains("_correct"));
      {
        spnEl.classList.add("_correct");
      }
    } else {
      console.log("|" + e.key + "-" + spanText + "|");
      spnEl.classList.add("_error");
      spnEl.classList.remove("_correct");
      spnEl.classList.remove("_fixed");
    }
    if (spnEl.nextElementSibling) {
      spnEl.nextElementSibling.classList.add("_focus");
    } else {
      if (spnEl.parentNode.nextElementSibling) {
        spnEl = spnEl.parentNode.nextElementSibling.firstChild;
        spnEl.classList.add("_focus");
      } else {
        startLesson();
      }
    }
  } else if (e.keyCode == 8) {
    if (spnEl.previousElementSibling) {
      spnEl.classList.remove("_focus");
      spnEl.previousElementSibling.classList.add("_focus");
      spnEl.previousElementSibling.classList.add("_clean");
    } else {
      spnEl.classList.remove("_focus");
      spnEl = spnEl.parentElement.previousElementSibling.lastChild;
      if (spnEl) {
        console.log("|" + e.key + "-" + spanText + "|");
        spnEl.classList.add("_focus");
        spnEl.classList.add("_clean");
      }
    }
  }
  console.log(e.key);
}

function getLineBreaks(node) {
  // we only deal with TextNodes
  if (!node || !node.parentNode || node.nodeType !== 3) return [];
  // our Range object form which we'll get the characters positions
  const range = document.createRange();
  // here we'll store all our lines
  const lines = [];
  // begin at the first char
  range.setStart(node, 0);
  // initial position
  let prevBottom = range.getBoundingClientRect().bottom;
  let str = node.textContent;
  let current = 1; // we already got index 0
  let lastFound = 0;
  let bottom = 0;
  // iterate over all characters
  while (current <= str.length) {
    // move our cursor
    range.setStart(node, current);
    if (current < str.length - 1) {
      range.setEnd(node, current + 1);
    }
    bottom = range.getBoundingClientRect().bottom;
    if (bottom > prevBottom) {
      // line break
      lines.push(
        str.substr(lastFound, current - lastFound) // text content
      );
      prevBottom = bottom;
      lastFound = current;
    }
    current++;
  }
  // push the last line
  lines.push(str.substr(lastFound));

  return lines;
}

function supportsImports() {
  return "import" in document.createElement("LINK");
}
