(function(){

  var w = 1024;
  var h = 512;
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  document.addEventListener("keyup", keyRelease);
  setInterval(gameLoop, 1000/15);

  var speed = 5;
  var x = 200;
  var y = 200;
  var dx = 0;
  var dy = 0;
  var fracRange = 50;
  var maxRank = 2;

  var pieces = [];
  var recSize = 32;

  // intersection
  function intersect(rec, circle)
  {
    var points = [
      {x: rec.x, y: rec.y},
      {x: rec.x+rec.w, y: rec.y},
      {x: rec.x, y: rec.y+rec.h},
      {x: rec.x+rec.w, y: rec.y+rec.h},
    ];
    for(var n = 0; n<4; n++)
    {
      var nx = points[n].x;
      var ny = points[n].y;
      var dcx = nx - circle.x;
      var dcy = ny - circle.y;
      var dss = dcx*dcx + dcy*dcy;
      if(dss < circle.r * circle.r) return true;
    }
    return false;
  }
  
  function updatePieces()
  {
    pieces = [];
    var circle = {x: x, y: y, r: fracRange};
    for(var i = 0; i < w/recSize; i++){
      for(var j = 0; j < h/recSize; j++){
        // intersection test with player circle
        var px = recSize*i;
        var py = recSize*j;
        var rec = {x: px, y: py, w: recSize, h: recSize};
        if( intersect(rec, circle) )
        {
          pieces.push({
            x: px,
            y: py,
            w: recSize,
            h: recSize,
          });
        }
      }
    }
  }

  function clear()
  {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,1024,1024);
  }

  function drawPieces()
  {
    ctx.strokeStyle = "red";
    //ctx.lineWidth = 1;
    for(var n = 0; n < pieces.length; n++){
      var p = pieces[n];
      ctx.strokeRect(p.x, p.y, p.w, p.h);
    }
  }

  function drawPlayer()
  {
    x += dx*speed;
    y += dy*speed;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
    ctx.fillRect(x-4,y-4,8,8);

    // draw high detail range
    ctx.beginPath();
    ctx.arc(x,y,fracRange,0,2*Math.PI);
    ctx.stroke();
  }

  function gameLoop()
  {
    updatePieces();
    clear();
    drawPieces();
    drawPlayer();
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