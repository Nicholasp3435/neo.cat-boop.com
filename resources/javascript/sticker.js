
// Code by mmaismma on Stack Overflow
// https://stackoverflow.com/a/63425707

const drag = document.getElementsByClassName("draggable");
const sheet = document.getElementById("sticker-sheet");
const stuck = document.getElementById("stuck-stickers");

for (let i = 0; i < drag.length; i++) {
  drag[i].style.position = "relative";
}

function filter(e) {
  let target = e.target;
  
  console.log(target);

  if (!target.classList.contains("draggable")) {
    return;
  }

  const scrollY = window.scrollY;

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

    const currentScrollY = window.scrollY
    const deltaY = currentScrollY - scrollY;

    target.style.filter = "drop-shadow(0.5rem 0.5rem 4px #000)";

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
    if (!target.classList.contains("stuck")) {
      target.style.top = target.oldTop + target.distY + "px";
    } else {
      target.style.top = target.oldTop + target.distY + deltaY + "px";
    }

  }

  function endDrag() {
    if (!target.classList.contains("draggable")) {
      return;
    }
    target.moving = false;
    target.style.filter = "none";
    if (!target.classList.contains("stuck")) {
      stuck.appendChild(target);
      target.classList.add("stuck");
      target.style.transform = "translateY(" + window.scrollY + "px) translateX("+ sheet.getBoundingClientRect().left + "px)";
    }
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