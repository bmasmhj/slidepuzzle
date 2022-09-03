

 function generate(x){
    var val =  document.getElementById('val').innerHTML;
    
    if(x == 1 ){
        var tempSize = parseInt(val)-1; 

    }else if (x==2){
        var tempSize = parseInt(val)+1; 
    }
    if(tempSize < 3 ){
        document.getElementById('dec').disabled = true; 
    }
    else if (tempSize > 11){
        document.getElementById('inc').disabled = true; 

    }
    else {
        document.getElementById('dec').disabled = false; 
    }
    document.getElementById('sizenum').innerHTML = tempSize+'x'+tempSize;
    document.getElementById('sizenums').innerHTML = tempSize+'x'+tempSize;
    document.getElementById('vals').innerHTML = tempSize;

    document.getElementById('val').innerHTML = tempSize;
    generatePuzzle(tempSize);
    // timer();    
}



function Pos(x, y) {
    this.x = x;
    this.y = y;
    }
    
    Pos.prototype.copy = function()
    {
    return new Pos(this.x, this.y);
    }
    
    Pos.prototype.set = function(pos)
    {
    this.x = pos.x;
    this.y = pos.y;
    }
    
    Pos.prototype.add = function(pos)
    {
    this.x += pos.x;
    this.y += pos.y;
    }
    
    Pos.prototype.subtract = function(pos)
    {
    this.x -= pos.x;
    this.y -= pos.y;
    }
    
    Pos.prototype.scale = function(number) {
    this.x *= number;
    this.y *= number;
    }
    
    Pos.prototype.equal = function(pos)
    {
    return (this.x == pos.x && this.y == pos.y);
    }
    
    function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    }
    
    Color.prototype.copy = function() {
    return new Color(this.r, this.g, this.b);
    }
    
    Color.prototype.set = function(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    }
    
    Color.prototype.convertToText = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }
    
    var slidePuzzle;
    
    function SlidePuzzle(size, isVisible) {
    this.size = size;
    this.isVisible = isVisible;
    this.tiles = null;
    this.emptyPos = null;
    this.hasWon = false;
    this.reset();
    this.shuffle();
    slidePuzzle = this;
    }
    
    SlidePuzzle.prototype.convertTileToColor = function(tile) {
    var index = tile - 1;
    var tempPosX = index % this.size;
    var tempPosY = Math.floor(index / this.size);
    var tempRed = Math.floor(255 * tempPosX / (this.size - 1));
    var tempGreen = Math.floor(255 * tempPosY / (this.size - 1));
    // (0, 0) -> (255, 255, 255)
    // (1, 0) -> (255, 0, 0)
    // (0, 1) -> (0, 255, 0)
    // (1, 1) -> (255, 255, 0)
    var tempWhite = 255 - Math.floor(tempRed + tempGreen)
    if (tempWhite < 0) {
    tempWhite = 0;
    }
    return new Color(tempRed + tempWhite, tempGreen + tempWhite, tempWhite);
    }
    
    SlidePuzzle.prototype.display = function() {
    var tempText = "";
    var tempLength = this.size * this.size;
    var index = 0;
    var width = 100/this.size;

    while (index < tempLength) {
    tempTile = this.tiles[index];
    if (tempTile == 0) {
    tempText += `<div class="emptySpace"  style="width : ${width}%!important ; height:0;padding-bottom:${width-5}%  " >`;
    } else {
    var tempColor = this.convertTileToColor(tempTile);
    tempText += `<div class="tiles" style="width : ${width}%!important ;  height:0;padding-bottom:${width-5}%  ">`;
    tempText += tempTile;
    }
    tempText += "</div>";
    index += 1;
    if (index % this.size == 0) {
    tempText += "<br style=\"clear: both;\" />";
    }
    }
    document.getElementById("slidePuzzle").innerHTML = tempText;
    }
    
    SlidePuzzle.prototype.reset = function() {
    this.tiles = [];
    var tempLength = this.size * this.size;
    var index = 0;
    while (index < tempLength) {
    if (index == tempLength - 1) {
    this.tiles[index] = 0;
    } else {
    this.tiles[index] = index + 1;
    }
    index += 1;
    }
    this.emptyPos = new Pos(this.size - 1, this.size - 1);
    if (this.isVisible) {
    this.display();
    }
    }
    
    SlidePuzzle.prototype.posIsInBounds = function(pos) {
    return (pos.x >= 0 && pos.x < this.size && pos.y >= 0 && pos.y < this.size);
    }
    
    SlidePuzzle.prototype.convertPosToIndex = function(pos) {
    return pos.x + pos.y * this.size;
    }
    
    SlidePuzzle.prototype.getTile = function(pos) {
    if (!this.posIsInBounds(pos)) {
    return 0;
    }
    var index = this.convertPosToIndex(pos);
    return this.tiles[index];
    }
    
    SlidePuzzle.prototype.setTile = function(pos, tile) {
    if (!this.posIsInBounds(pos)) {
    return;
    }
    var index = this.convertPosToIndex(pos);
    this.tiles[index] = tile;
    }
    
    var offsetSet = [new Pos(0, -1), new Pos(1, 0), new Pos(0, 1), new Pos(-1, 0)];
    
    SlidePuzzle.prototype.moveTile = function(direction, isShuffling) {
    var tempOffset = offsetSet[direction];
    var tempPos = this.emptyPos.copy();
    tempPos.add(tempOffset);
    if (!this.posIsInBounds(tempPos)) {
    return;
    }
    var tempTile = this.getTile(tempPos, isShuffling);
    this.setTile(tempPos, 0);
    this.setTile(this.emptyPos, tempTile);
    this.emptyPos.set(tempPos);
    if (!isShuffling) {
    if (this.isVisible) {
    this.display();
    }
    this.checkForVictory();
    }
    }
    
    SlidePuzzle.prototype.shuffle = function() {
    var lastMove = -1;
    var tempCount = this.size * this.size * 300;
    while (tempCount > 0) {
    var tempMove = Math.floor(Math.random() * 4);
    if (tempMove != (lastMove + 2) % 4) {
    this.moveTile(tempMove, true);
    lastMove = tempMove;
    tempCount -= 1;
    }
    }
    if (this.isVisible) {
    this.display();
    }
    }
    
    SlidePuzzle.prototype.checkForVictory = function() {
    if (this.hasWon) {
    return;
    }
    var tempHasWon = true;
    var tempLength = this.size * this.size;
    var index = 0;
    while (index < tempLength) {
    var tempTile = this.tiles[index];
    var tempExpectedTile;
    if (index == tempLength - 1) {
    tempExpectedTile = 0;
    } else {
    tempExpectedTile = index + 1;
    }
    if (tempTile != tempExpectedTile) {
    tempHasWon = false;
    }
    index += 1;
    }
    if (tempHasWon) {
    this.hasWon = true;
    if (this.isVisible) {
        // alert("CONGRATULATION YOU ARE WIN");
        show();
    }
    }
    }
    
    function generatePuzzle(size) {
    if (isNaN(size)) {
    return;
    }
    if (size < 2 || size > 50) {
    return;
    }
    new SlidePuzzle(size, true);
    }
    
    function keyDownEvent(event) {
    var keyCode = event.which;
        if (keyCode == 38 || keyCode == 87) {
            slidePuzzle.moveTile(2, false);
            activethis(1);
            return false;
        }
        if (keyCode == 39 || keyCode == 68) {
            slidePuzzle.moveTile(3, false);
            activethis(2);

            return false;
        }
        if (keyCode == 40 || keyCode == 83) {
            slidePuzzle.moveTile(0, false);
            activethis(3);

            return false;
        }
        if (keyCode == 37 || keyCode == 65) {
            slidePuzzle.moveTile(1, false);
            activethis(4);

            return false;
        }
    }

    function btnevent(bt) {
        if (bt == 1) {
            slidePuzzle.moveTile(2, false);
            activethis(1);

            return false;
        }
        if (bt == 2) {
            slidePuzzle.moveTile(3, false);
            activethis(2);

            return false;
        }
        if (bt == 3) {
            slidePuzzle.moveTile(0, false);
            activethis(3);

            return false;
        }
        if (bt == 4) {
            slidePuzzle.moveTile(1, false);
            activethis(4);

            return false;
        }
    }

    function activethis(act) {
    var move = document.getElementById('movement');
        move.value = parseInt(move.value)+1;

       var u = document.getElementById('up');
       var l = document.getElementById('lft');
       var d = document.getElementById('dwn');
       var r = document.getElementById('rght');

        if (act == 1) {
            u.classList.add("active");
            removeclass(u);
        }
        if (act == 2) {
            r.classList.add("active");
            removeclass(r);

        }
        if (act == 3) {
            d.classList.add("active");
            removeclass(d);

        }
        if (act == 4) {
            l.classList.add("active");
            removeclass(l);

        }

        function removeclass(x){
            setTimeout(() => {
                x.classList.remove('active');
            }, 200);
        }

    }


    function timer() {
        var ms = 0;
        var s = 0;
        var m = 0;
        var h = 0;

         var timer = setInterval(function(){
            ms++;
            if(ms === 100 ){
                s++;
                ms = 0;
            }
            if(s == 60){
                m++;
                s = 0;
            }
            if( m == 60 ){
                h++;
                m = 0;
            }
            if(h == 24 ){
                clearInterval(timer);
            }

            document.getElementById('timer').innerHTML = h+' : ' +m+' : '+ s+' : '+ms;

        },10);
    }


function show() { 
    var move = document.getElementById('movement').value;

Swal.fire({
    title: 'Congratulatin',
    text: `You are champ ! You completed in ${move} moves`,
    icon: 'success',
    showCancelButton: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Play again',
    backdrop: `
    rgba(0,0,123,0.4)
    url("assets/img/nyan-cat.gif")
    left top
    no-repeat
  `
}

  ).then((result) => {

  if (result.isConfirmed) {
    var val =  document.getElementById('val').innerHTML;
    var tempSize = parseInt(val); 
    generatePuzzle(tempSize);
}
} );



}