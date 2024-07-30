type Point = { x: number, y: number };
type Directions = { [key: string]: Point };
type Snake = { body: Record<string, Point> };

function snakeAvoider(availableDirections: Directions, allSnakes: any[]): Directions {
    const safeDirections: Directions = { ...availableDirections };

    for (const snk of allSnakes) {
      for (const move in safeDirections) {
        if (safeDirections.hasOwnProperty(move)) {
          if (snk.body.some((part: Point) => part.x === safeDirections[move].x && part.y === safeDirections[move].y)) {
            delete safeDirections[move];
          }
        }
      }
    }

    return safeDirections;
}