function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  console.log(Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight));

  console.log(document.getElementById("main").offsetWidth - 600);

  return metrics.width;
}

{
  /* <div>
<textarea rows="4" cols="50" name="comment" onInput="showCurrentValue(event)">Describe yourself here...</textarea><br />
The text box contains: <span id="label">Some text</span>
</div> */
}

function showCurrentValue(event) {
  const value = event.target.value;
  document.getElementById("main").innerText = value;
}

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    alert("Left was pressed");
  } else if (event.keyCode == 39) {
    alert("Right was pressed");
  }
});

var font = getComputedStyle(document.getElementById("main")).getPropertyValue("font-family");
console.log(font);
if (linesArr.length >= 2) {
  console.log(getTextWidth(linesArr[0] + " " + linesArr[1], font));
}

function talk() {
  // var msg = new SpeechSynthesisUtterance();
  // msg.text = document.getElementById("message").value;
  // if (msg.text) {
  //   // document.getElementById("message").value = "";
  //   window.speechSynthesis.speak(msg);
  // }
  // if (currLine < linesArr.length) {
  //   // console.log(linesArr[currLine++]);
  //   document.getElementById("main").innerHTML += linesArr[currLine++];
  // } else {
  //   console.log("End of text");
  // }

  string = document.getElementById("inputText").value;
  string = string.replace(/\s\s+|\n/g, " ");
  document.getElementById("main").innerText = string;
  document.getElementById("inputText").style.display = "none";
  document.getElementById("main").style.display = "block";
  initialize_page();
}
