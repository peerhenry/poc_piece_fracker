(function(){

  var w = 1024;
  var h = 512;
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  document.addEventListener("keyup", keyRelease);
  setInterval(gameLoop, 1000/15);

  var speed = 5;
  var x = 10;
  var y = 10;
  var dx = 0;
  var dy = 0;
  
  function drawGrid()
  {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,1024,1024);

    ctx.strokeStyle = "red";
    var recSize = 32;
    for(var i = 0; i < w/recSize; i++){
      for(var j = 0; j < h/recSize; j++){
        ctx.rect(
          recSize*i,
          recSize*j,
          recSize,
          recSize
        );
      }
    }
    ctx.stroke();
  }

  function gameLoop()
  {
    drawGrid();
    x += dx*speed;
    y += dy*speed;
    ctx.fillStyle = "green";
    ctx.fillRect(x,y,8,8);
  }

  function keyPush(ev)
  {
    switch(ev.keyCode)
    {
      case 37:
        dx = -1;
        break;
      case 38:
        dy = -1;
        break;
      case 39:
        dx = 1;
        break;
      case 40:
        dy = 1;
        break;
    }
  }

  function keyRelease(ev)
  {
    switch(ev.keyCode)
    {
      case 37:
        dx = 0;
        break;
      case 38:
        dy = 0;
        break;
      case 39:
        dx = 0;
        break;
      case 40:
        dy = 0;
        break;
    }
  }
})();