type Point = { x: number, y: number };
type Directions = { [key: string]: Point };
type Snake = { body: Record<string, Point> };

function snakeAvoider(availableDirections: Directions, allSnakes: any[]): Directions {
    const safeDirections: Directions = { ...availableDirections };

    const movesToBeDeleted: string[] = [];

    for (const snk of allSnakes) {
      for (const move in safeDirections) {
        const getPosition = safeDirections[move];

        if (getPosition.x === snk.body[0].x && getPosition.y === snk.body[0].y) {
          movesToBeDeleted.push(move);
        }
      }
    }

    // remove the moves that are duplicates in movesToBeDeleted
    const remove = movesToBeDeleted.filter((item, index) => movesToBeDeleted.indexOf(item) === index);

    remove.forEach(move => {
      delete safeDirections[move];
    });

    return safeDirections;
}