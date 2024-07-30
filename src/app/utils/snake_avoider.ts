type Point = { x: number, y: number };
type Directions = { [key: string]: Point };
type Snake = { body: Record<string, Point> };

function snakeAvoider(availableDirections: Directions, allSnakes: any[]): Directions {
    const safeDirections: Directions = { ...availableDirections };

    for (const snk of allSnakes) {
      for (const move in safeDirections) {
        if (safeDirections.hasOwnProperty(move)) {
          const newPosition = safeDirections[move];
          if (newPosition.x === snk.body[0].x && newPosition.y === snk.body[0].y) {
            delete safeDirections[move];
          }
        }
      }
    }

    return safeDirections;
}