type Point = { x: number, y: number };
type Directions = { [key: string]: Point };
type Snake = { body: Record<string, Point> };

function snakeAvoider(availableDirections: Directions, allSnakes: Record<string, Snake>): Directions {
    const safeDirections: Directions = { ...availableDirections };

    // Remove moves that collide with other snakes
    for (const snakeKey in allSnakes) {
        if (allSnakes.hasOwnProperty(snakeKey)) {
            const snake = allSnakes[snakeKey];
            for (const move in safeDirections) {
                if (safeDirections.hasOwnProperty(move)) {
                    const newPosition = safeDirections[move];
                    for (const segmentKey in snake.body) {
                        if (snake.body.hasOwnProperty(segmentKey)) {
                            const segment = snake.body[segmentKey];
                            if (segment.x === newPosition.x && segment.y === newPosition.y) {
                                delete safeDirections[move];
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    return safeDirections;
}