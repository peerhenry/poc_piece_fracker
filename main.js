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
  var fracRange = 50; // frac to rank 0
  var fracRange2 = 150; // frac to rank 2
  var maxRank = 4;

  var pieces = [];
  var recSize = 16;

  var pieceMap = {}

  function pieceExists(rec)
  {
    return retrievePiece(rec) != undefined;
  }

  function retrievePiece(rec)
  {
    if(rec.rank == maxRank) return pieceMap[JSON.stringify(rec.site)];
    else{
      var p = retrievePiece(rec.parent);
      if(p == undefined) return undefined;
      return p[JSON.stringify(rec.site)];
    }
  }

  function registerPiece(rec)
  {
    if(rec.rank == maxRank) pieceMap[JSON.stringify(rec.site)] = rec;
    else{
      var p = retrievePiece(rec.parent);
      if(p == undefined) p = registerPiece(rec.parent);
      p[ JSON.stringify(rec.site) ] = rec;
      p.isFracked = true;
    }
    return rec;
  }

  function unFracPiece(rec)
  {
    rec[JSON.stringify({i: 0, j: 0})] = undefined;
    rec[JSON.stringify({i: 1, j: 0})] = undefined;
    rec[JSON.stringify({i: 0, j: 1})] = undefined;
    rec[JSON.stringify({i: 1, j: 1})] = undefined;
    rec.isFracked = false;
  }

  function appendPiece(rec)
  {
    if(pieceExists(rec))
    {
      rec = retrievePiece(rec);
      if(rec.isFracked)
      {
        rec.fadeVal = 1;
        unFracPiece(rec);
      }
      else rec.fadeVal -= 0.04;
    }
    else
    {
      rec.isFracked = false;
      rec.fadeVal = 1;
      registerPiece(rec);
    }
    pieces.push(rec);
  }

  function getFracRange(rank)
  {
    if(rank > 2) return fracRange2;
    return fracRange;
  }

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

  function withinFracRange(rec)
  {
    var dss = sqDistRec({x: x, y: y}, rec);
    var r = getFracRange(rec.rank);
    if(dss < r * r) return true;
    return false;
  }

  function frack(rec)
  {
    if(rec.rank == 0) appendPiece(rec);
    else if( !withinFracRange(rec) ) appendPiece(rec);
    else{
      var smallerW = rec.w/2;
      var smallerH = rec.h/2;
      for(var si = 0; si < 2; si++)
        for(var sj = 0; sj < 2; sj++)
        {
          var smallerRec = { x: rec.x + si*smallerW, y: rec.y + sj*smallerH, w: smallerW, h: smallerH, rank: (rec.rank -1), parent: rec, site: {i: si, j: sj} };
          frack(smallerRec);
        }
    }
  }
  
  function updatePieces()
  {
    pieces = [];
    var maxRankSize = recSize*Math.pow(2, maxRank);
    for(var bi = 0; bi < w/maxRankSize; bi++){
      for(var bj = 0; bj < h/maxRankSize; bj++){

        var maxRec = {x: maxRankSize*bi, y: maxRankSize*bj, w: maxRankSize, h: maxRankSize, rank: maxRank, site: {i: bi, j: bj}};
        frack(maxRec);
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
      ctx.fillStyle = "rgba(32, 45, 255, " + p.fadeVal + ")"; 
      ctx.fillRect(p.x, p.y, p.w, p.h);
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

    ctx.beginPath();
    ctx.arc(x,y,fracRange2,0,2*Math.PI);
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