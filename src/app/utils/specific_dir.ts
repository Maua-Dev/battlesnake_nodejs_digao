type Point = { x: number, y: number };
type Directions = { [key: string]: Point };

export function findClosestFood(foodPositions: Record<string, Point>, snakeHead: Point, availableDirections: Directions): Directions {
    let closestFoodKey: string | null = null;
    let minDistance: number | null = null;

    for (const key in foodPositions) {
      const food = foodPositions[key];
      const distance = Math.abs(snakeHead.x - food.x) + Math.abs(snakeHead.y - food.y);
      if (minDistance === null || distance < minDistance) {
          closestFoodKey = key;
          minDistance = distance;
      }
    }

    if (closestFoodKey === null) {
      return availableDirections; // No food found
    }

    const closestFood = foodPositions[closestFoodKey];

    const directionX = snakeHead.x < closestFood.x ? 'right' : snakeHead.x > closestFood.x ? 'left' : '';
    const directionY = snakeHead.y < closestFood.y ? 'up' : snakeHead.y > closestFood.y ? 'down' : '';

    const optimalDirections: Directions = { ...availableDirections };
    for (const move in optimalDirections) {
      if (directionX && move !== directionX) {
          delete optimalDirections[move];
      }
      if (directionY && move !== directionY) {
          delete optimalDirections[move];
      }
    }

    return Object.keys(optimalDirections).length === 0 ? availableDirections : optimalDirections;
}
