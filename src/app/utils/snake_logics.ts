interface Point {
  x: number;
  y: number;
}

export function possibleMoves(p: Record<string, number>) {
  return {
    up:    { dir: 'up',    x: p.x, y: p.y - 1, ok: true },
    right: { dir: 'right', x: p.x + 1, y: p.y, ok: true },
    down:  { dir: 'down',  x: p.x, y: p.y + 1, ok: true },
    left:  { dir: 'left',  x: p.x - 1, y: p.y, ok: true },
  };
}

export function tryToEat(board: any, myHead: any, moves: any) {
  console.log("tryToEat");
  let food = board.findFood(myHead);
  console.log(food);
  for (let f of food) {
    let routes = board.bestRoutes(myHead, f);
    for (let r of routes) {
      if (moves[r].ok) {
        console.log(moves[r]); 
        return moves[r];
      }
    }
  }

  return null;
}

export function tryToKill(board: any, myHead: any, moves: any) {
  console.log("tryToKill");
  let edibleSnakes = board.edibleSnakes(myHead);
  console.log('edibleSnakes');
  console.log(edibleSnakes);
  for (let snake of edibleSnakes) {
    let guess = board.guessSnakesNextPosition(snake);
    console.log('guess');
    console.log(guess);
    let routes = board.bestRoutes(myHead, guess);
    console.log('routes');
    console.log(routes);
    for (let r of routes) {
      if (moves[r].ok) { 
        console.dir(moves[r]);
        return moves[r];
      }
    }
  }

  return null;
}

export function firstAvailableMove(moves: any) {
  const DIRECTIONS = [ 'up', 'right', 'down', 'left'];
  console.log('firstAvailableMove');
  for (let d of DIRECTIONS) {
    if (moves[d].ok)
      return moves[d];
  }

  return null;
}


export function avoidMyNeck(myHead: any, myBody: Array<any>) {
  const possibleMoves: { [key: string]: Point } = {
      up: { x: myHead.x, y: myHead.y + 1 },
      down: { x: myHead.x, y: myHead.y - 1 },
      left: { x: myHead.x - 1, y: myHead.y },
      right: { x: myHead.x + 1, y: myHead.y }
  }
  const remove: string[] = [];
  for (const move in possibleMoves) {
      if (myBody.some(segment => segment.x === possibleMoves[move].x && segment.y === possibleMoves[move].y)) {
          remove.push(move);
      }
  }
  remove.forEach(move => {
      delete possibleMoves[move];
  });

 return possibleMoves;

}

export function getCloseFood(foods: Array<Point>, myHead: Point, directions: { [key: string]: Point }) {
  let closestFood = foods[0];
  let minDistance = Math.abs(myHead.x - closestFood.x) + Math.abs(myHead.y - closestFood.y);
  for (const food of foods) {
      const distance = Math.abs(myHead.x - food.x) + Math.abs(myHead.y - food.y);
      if (distance < minDistance) {
          closestFood = food;
          minDistance = distance;
      }
  }

  const directionX = myHead.x < closestFood.x ? 'right' : myHead.x > closestFood.x ? 'left' : '';
  const directionY = myHead.y < closestFood.y ? 'up' : myHead.y > closestFood.y ? 'down' : '';

  const bestDirections: { [key: string]: Point } = Object.assign({}, directions);
  for (const move in bestDirections) {
      if (directionX !== '' && move !== directionX) {
          delete bestDirections[move];
      }
      if (directionY !== '' && move !== directionY) {
          delete bestDirections[move];
      }
  }

  if (Object.keys(bestDirections).length === 0) {
      return directions;
  }
  else{
      return bestDirections;
  }
}

export function getKeys(obj: Record<string, any>): string[] {
  const keys: string[] = [];
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          keys.push(key);
      }
  }
  return keys;
}

type Directions = { [key: string]: Point };

export function avoidWallCollisions(availableDirections: Directions, boardWidth: number, boardHeight: number): Directions {
    const safeDirections: Directions = { ...availableDirections };


    for (const move in safeDirections) {
        if (safeDirections.hasOwnProperty(move)) {
            const newPosition = safeDirections[move];
            if (newPosition.x < 0 || newPosition.x >= boardWidth || newPosition.y < 0 || newPosition.y >= boardHeight) {
                delete safeDirections[move];
            }
        }
    }

    return safeDirections;
}