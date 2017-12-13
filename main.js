(function(){

  var w = 1536;
  var h = 768;
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
  var maxRank = 4;

  var pieces = [];
  var recSize = 16;

  function getSqDist(x1, x2)
  {
    var temp = x1 - x2;
    return temp*temp;
  }

  function sqDistRec(point, rec)
  {
    var sqd = 0;
    if( point.x < rec.x ) sqd += getSqDist(point.x, rec.x);
    if( point.x > rec.x + rec.w ) sqd += getSqDist(point.x, rec.x + rec.w);
    if( point.y < rec.y ) sqd += getSqDist(point.y, rec.y);
    if( point.y > rec.y + rec.h ) sqd += getSqDist(point.y, rec.y + rec.h);
    return sqd;
  }

  // intersection
  function intersect(rec, circle)
  {
    var dss = sqDistRec({x: circle.x, y: circle.y}, rec);
    if(dss < circle.r * circle.r) return true;
    return false;
  }

  function frack(rec, circle)
  {
    if(rec.rank <= 0) pieces.push(rec);
    else{
      var smallerW = rec.w/2;
      var smallerH = rec.h/2;
      for(var si = 0; si < 2; si++)
        for(var sj = 0; sj < 2; sj++)
        {
          var smallerRec = { x: rec.x + si*smallerW, y: rec.y + sj*smallerH, w: smallerW, h: smallerH, rank: (rec.rank -1) };
          if( intersect(smallerRec, circle) ) frack(smallerRec, circle);
          else pieces.push(smallerRec);
        }
    }
  }
  
  function updatePieces()
  {
    pieces = [];
    var circle = {x: x, y: y, r: fracRange};
    var maxRankSize = recSize*Math.pow(2, maxRank);
    for(var bi = 0; bi < w/maxRankSize; bi++){
      for(var bj = 0; bj < h/maxRankSize; bj++){

        var maxRec = {x: maxRankSize*bi, y: maxRankSize*bj, w: maxRankSize, h: maxRankSize, rank: maxRank};
        if( intersect(maxRec, circle) )
        {
          frack(maxRec, circle);
        }
        else
        {
          pieces.push(maxRec);
        }
      }
    }
  }

  function clear()
  {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w,h);
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