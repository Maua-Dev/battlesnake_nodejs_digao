import lodash from 'lodash';

export function whatDir(head: any, next: any) {
  if(next.x > head.x) {
    return 'right'
  } else if (next.x < head.x) {
    return 'left'
  } else if (next.y < head.y) {
    return 'up'
  } else {
    return 'down'
  }
}

export function getCurrentDir(head: any, prev: any) {
  let xDir = head.x - prev.x
  let yDir = head.y - prev.y
  if(xDir < 0) {
    return "left"
  } else if(xDir > 0) {
    return "right"
  } else if(yDir < 0) {
    return "up"
  } else {
    return "down"
  }
}

export function findAllSnakes(board: Record<string, any>) {
  const resp = lodash.flatten(lodash.map(board.snakes, (snake) => snake.body));
  console.log('resp FIND ALL SNAKES:', resp)
  return resp 
}

export function reduceAllSnakes(allSnakes: any) {
  const resp = lodash.reduce(allSnakes, (acc: any, snake) => {
    acc[`${snake.x},${snake.y}`] = true;
    return acc;
  }, {}); 
  
  console.log('resp REDUCE ALL SNAKES:', resp)

  return resp
}

export function positionDiff(arr: any[], secondArr: any[]) {
  const resp = lodash.differenceWith(arr, secondArr, (x,y) => {
    return x.x === y.x && x.y === y.y 
  })
  console.log('resp POSITION DIFF:', resp)

  return resp
}

export function removeOOB(arr: any[], width: any, height: any) {
  return arr.filter((pos) => {
    return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height
  })
}

export function getMoveOptions(allSnakes: any, head: any, width: any, height: any) {
  const generateOptions = [{x: head.x, y: head.y + 1}, {x: head.x, y: head.y - 1}, {x: head.x + 1, y: head.y}, {x: head.x - 1, y: head.y}]
  return removeOOB(positionDiff(generateOptions, allSnakes), width, height)
}

export function getNeighbors(position: Record<string, any>) {
	return [{x: position.x, y: position.y + 1}, {x: position.x, y: position.y - 1}, {x: position.x + 1, y: position.y}, {x: position.x - 1, y: position.y}]
}

export function validFlood(width: any, height: any, snakeParts: any[], flooded: any[], position: Record<string, any>) {
  console.log('VALID FLOOD SNAKE PARTS', snakeParts)
  
  if (position.x < 0 || position.y < 0 || position.x >= width || position.y >= height) return false
	// x, y is not a snake part
	if (snakeParts.find((part) => part.x === position.x && part.y === position.y)) return false
	// x, y is not in flooded
	if (flooded.find((part) => part.x === position.x && part.y === position.y)) return false
	
	return true
}

export function floodFrom(width: any, height: any, snakeParts: any[], max: any, position: Record<string, any>) {
  let flooded: any = {}

  let space = 0
  let stack = [position]

  while((space < max + 1) && (stack.length > 0)) {
    let current = stack.pop()
    space += 1
    flooded[`${current!.x},${current!.y}`] = true

    let isValid = lodash.partial(validFlood, width, height, snakeParts, flooded)
    let pushToStack = lodash.partialRight(lodash.forEach, (neighbor: any) => {
      stack.push(neighbor)
    })

    let neighbors = getNeighbors(current!)
    let validNeighbors = lodash.filter(neighbors, isValid)

    pushToStack(validNeighbors)
  }

  return space
}

export function getSmallestDistance(point: any, pointArray: any[]) {
  const absPointDiff = (point1: any, point2: any) => {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
  }
  const headDiff = lodash.partial(absPointDiff, point)
  const min = lodash.min(lodash.map(pointArray, headDiff))
  return min
}

export function getHungry(food: any[]) {
  let hungryMod = 40 - (food.length * 4)

  if(hungryMod < 0) {
    hungryMod = 0
  } else if (hungryMod > 40) {
    hungryMod = 40
  }

  return 50 + hungryMod
}


export function pyDiff(point1: any, point2: any) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

export function smallestPyDist(point: any, pointArray: any) {
  const headDifference = lodash.partial(pyDiff, point)
  let min = lodash.min(lodash.map(pointArray, headDifference))
  return min
}

export function collisionAvoider(moveOptions: any, snekParts: any, myBody: any, head: any) {
  const absPointDiff = (point1: any, point2: any) => {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
  }
  const distToSnek = lodash.partialRight(smallestPyDist, snekParts)
  const distToTail = lodash.partial(absPointDiff, lodash.last(myBody))
  const sorted = lodash.reverse(lodash.sortBy(moveOptions, distToSnek, (x) => distToTail(x)))
  
  return whatDir(head, sorted[0])
}

export function foodSeeker(moveOptions: any, boardFood: any, head: any) {
  const distToFood = lodash.partialRight(getSmallestDistance, boardFood)
  const sorted = lodash.sortBy(moveOptions, distToFood)
  
  return whatDir(head, sorted[0])
}

export function tailChaser(moveOptions: any, myBody: any, head: any) {
  const absPointDiff = (point1: any, point2: any) => {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
  }
  const current_dir = getCurrentDir(head, myBody[1])
  const distToTail = lodash.partial(absPointDiff, lodash.last(myBody))
  const sorted = lodash.sortBy(moveOptions, distToTail, (x) => whatDir(head, x) != current_dir ? 1 : -1)

  return whatDir(head, sorted[0] || lodash.last(myBody))
}
