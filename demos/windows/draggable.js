// https://stackoverflow.com/a/18234150
const hasParent = (element, ...parents) => parents.some((parent) => parent.contains(element))
const menu = document.getElementById("menu");


// Code by mmaismma on Stack Overflow
// https://stackoverflow.com/a/63425707

const d = document.getElementsByClassName("draggable");
var highestZ = 1;



for (let i = 0; i < d.length; i++) {
  d[i].style.position = "relative";
}

function filter(e) {
  let target = e.target;


  if (target.classList.contains("start")) {
    menu.style.visibility = "unset";
    return;
  }

  if (hasParent(target, menu)) {
    menu.style.visibility = "unset";
  } else {
    menu.style.visibility = "hidden";
  }


  if (!target.classList.contains("draggable")) {
    return;
  }

  target.style.zIndex = highestZ;
  highestZ++;

  target.moving = true;

  //NOTICE THIS 👇 Check if Mouse events exist on users' device
  if (e.clientX) {
    target.oldX = e.clientX; // If they exist then use Mouse input
    target.oldY = e.clientY;
  } else {
    target.oldX = e.touches[0].clientX; // Otherwise use touch input
    target.oldY = e.touches[0].clientY;
  }
  //NOTICE THIS 👆 Since there can be multiple touches, you need to mention which touch to look for, we are using the first touch only in this case

  target.oldLeft = window.getComputedStyle(target).getPropertyValue('left').split('px')[0] * 1;
  target.oldTop = window.getComputedStyle(target).getPropertyValue('top').split('px')[0] * 1;

  document.onmousemove = dr;
  //NOTICE THIS 👇
  document.ontouchmove = dr;
  //NOTICE THIS 👆

  function dr(event) {
    event.preventDefault();

    if (!target.moving) {
      return;
    }
    //NOTICE THIS 👇
    if (event.clientX) {
      target.distX = event.clientX - target.oldX;
      target.distY = event.clientY - target.oldY;
    } else {
      target.distX = event.touches[0].clientX - target.oldX;
      target.distY = event.touches[0].clientY - target.oldY;
    }
    //NOTICE THIS 👆

    target.style.left = target.oldLeft + target.distX + "px";
    target.style.top = target.oldTop + target.distY + "px";
  }

  function endDrag() {
    target.moving = false;    
  }
  target.onmouseup = endDrag;
  //NOTICE THIS 👇
  target.ontouchend = endDrag;
  //NOTICE THIS 👆
}
document.onmousedown = filter;
//NOTICE THIS 👇
document.ontouchstart = filter;
//NOTICE THIS 👆


function openInNewTab(url) {
  window.open(url, '_blank').focus();
}

const windowBar = document.getElementById("windows");


function makeWindow(src, id, name, icon) {

  if(document.body.contains(document.getElementById(id))) {
    document.getElementById(id).style.zIndex = highestZ;
    highestZ++;
    return;
  }

  const window = document.createElement('div');
  window.classList.add("draggable");
  window.id = id;

  const backImg = document.createElement('img');
  backImg.classList.add("back");
  window.appendChild(backImg);

  const iconImg = document.createElement('img');
  iconImg.classList.add("icon");
  iconImg.src = icon;
  window.appendChild(iconImg);

  const title = document.createElement('p');
  title.innerHTML = name;
  window.appendChild(title);

  const xBtn = document.createElement('button');

  const windowBtn = document.createElement('button');

  xBtn.classList.add("x");
  xBtn.innerHTML = "X";
  xBtn.onclick = function() {window.remove(); windowBtn.remove();};
  window.appendChild(xBtn);

  const maxBtn = document.createElement('button');
  maxBtn.classList.add("max");
  maxBtn.innerHTML = "□";
  maxBtn.onclick = function() {openInNewTab(src);};
  window.appendChild(maxBtn);

  const minBtn = document.createElement('button');
  minBtn.classList.add("min");
  minBtn.innerHTML = "_";
  minBtn.onclick = function() {
    window.style.visibility = "hidden";
  };
  window.appendChild(minBtn);

  const mainFrame = document.createElement('iframe');
  mainFrame.classList.add("windowFrame");
  mainFrame.src = src;
  window.appendChild(mainFrame);

  document.body.appendChild(window);

  // declared windowBtn earlier
  windowBtn.innerHTML = name;
  windowBtn.prepend(iconImg.cloneNode());
  windowBtn.onclick  = function() {
    if (window.style.visibility === "hidden") {
      window.style.visibility = "unset";
      window.style.zIndex = highestZ;
      highestZ++;
    } else {
      window.style.visibility = "hidden";
    }
  };

  windowBar.appendChild(windowBtn);

  menu.style.visibility = "hidden";
}

function updateDateTime() {
  // create a new `Date` object
  const now = new Date();
  
  // update the `textContent` property of the `span` element with the `id` of `datetime`
  document.getElementById("clock").innerHTML = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
}

updateDateTime();
setInterval(updateDateTime, 1000);
