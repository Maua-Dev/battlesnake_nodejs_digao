function Board(data: any) {

  const board = data.board;
  const grid = createGrid(board);

  return {
    board,
    grid,
    isOnBoard,
    canMoveTo,
    findFood,
    edibleSnakes,
    guessSnakesNextPosition,
    checkOK,
    bestRoutes
  }

  function isOnBoard(p: any) {
    return (p.x >= 0) && (p.y >= 0) &&
      (p.x < board.width) && (p.y < board.height);
  }

  function canMoveTo(p: any) {
    let c = grid[p.x][p.y];
    return (c === ' ') || (c === 'F');
  }

/**
 * Combination - find if a point seems ok to move to.
 */
  function checkOK(points: any) {
    for (let p of points)
      p.ok = isOnBoard(p) && canMoveTo(p);
  }


  function createGrid(board: any) {

    let grid = [];
    for (let x = 0; x < board.width; x++)
      grid[x] = Array(board.height).fill(' ');

    for (let snake of board.snakes) {
      for (let p of snake.body)
        grid[p.x][p.y] = 'S';
    }

    for (let p of data.you.body)
      grid[p.x][p.y] = 'M';

    for (let p of board.food)
      grid[p.x][p.y] = 'F';

   // console.dir(grid);
    return grid;
  }

/**
 * Finds food, sorted by distance from p
 * returns [], possibly empty
 */
  function findFood(p: any) {
    let food = board.food;
    if (food.length > 1) {  // we need to sort
      for (let f of food)
        f.distance = cityBlocksBetween(p, f);

      food.sort(function(a: any , b: any) { return a.distance - b.distance } );
    }

    return food;
  }


/**
 * Find snakes smaller than us, sorted by distance from p
 * returns [], possibly empty
 */
  function edibleSnakes(p: any) {
    let myLength = data.you.body.length;
    let edibles = [];
    for (let snake of board.snakes) {
      if (snake.body.length < myLength)
        edibles.push(snake);
    }

    if (edibles.length > 1) {  // need to sort
      for (let snake of edibles)
        snake.distance = cityBlocksBetween(p, snake.body[0]);

      edibles.sort(function(a, b) { return a.distance - b.distance } );
    }

    return edibles;
  }

/**
 * Not very bright logic...
 */
  function guessSnakesNextPosition(snake: any) {
    let head = snake.body[0];
    let seg1 = snake.body[1];

    let dx = head.x - seg1.x;
    let dy = head.y - seg1.y;

    return { x: head.x + dx, y: head.y + dy }
  }


/**
 * Finds one or two directions that head from from to to
 * returns [] with 1 or 2 values
 */
  function bestRoutes(from: any, to: any) {
    let directions = [];
    let dx = to.x - from.x;
    let dy = to.y - from.y;

   // console.dir({ what: "bestRoutes", from, to });

    if (Math.abs(dx) >= Math.abs(dy)) { // horizontal movement preferred
      directions.push( (dx > 0) ? 'right' : 'left');
      if (dy)
        directions.push( (dy > 0) ? 'down' : 'up');  // 2nd choice
    }
    else { // vertical movement
      directions.push( (dy > 0) ? 'down' : 'up');
      if (dx)
        directions.push( (dx > 0) ? 'right' : 'left');  // 2nd choice
    }

    // console.dir(directions);

    return directions;
  }

}

function samePoints(p1: any, p2: any) { return (p1.x === p2.x) && (p1.y === p2.y); }
function cityBlocksBetween(p1: any, p2: any) { return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y); }

export {
  Board,
  cityBlocksBetween,
  samePoints,
}
