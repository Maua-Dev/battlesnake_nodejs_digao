type Point = { x: number, y: number };
type Moves = { [key: string]: Point };

export function getRandomMove(headPosition: Point, bodyPositions: Record<string, Point>): Moves {
    const tailKey = Object.keys(bodyPositions).pop();
    const thirdPartKey = Object.keys(bodyPositions)[Object.keys(bodyPositions).length - 2];

    if (!tailKey || !thirdPartKey) {
        return {};
    }

    const tailPosition = bodyPositions[tailKey];
    const thirdPartPosition = bodyPositions[thirdPartKey];

    let possibleMoves: Moves = {};

    if (thirdPartPosition.y === headPosition.y) {
        possibleMoves = {
            up: { x: headPosition.x, y: headPosition.y + 1 },
            down: { x: headPosition.x, y: headPosition.y - 1 },
        };
    } else if (thirdPartPosition.x === headPosition.x) {
        possibleMoves = {
            left: { x: headPosition.x - 1, y: headPosition.y },
            right: { x: headPosition.x + 1, y: headPosition.y }
        };
    } else {
        const directionX = headPosition.x < tailPosition.x ? 'right' : headPosition.x > tailPosition.x ? 'left' : '';
        const directionY = headPosition.y < tailPosition.y ? 'up' : headPosition.y > tailPosition.y ? 'down' : '';

        if (directionX === 'right') {
            possibleMoves['right'] = { x: headPosition.x + 1, y: headPosition.y };
        }
        if (directionY === 'up') {
            possibleMoves['up'] = { x: headPosition.x, y: headPosition.y + 1 };
        }
        if (directionX === 'left') {
            possibleMoves['left'] = { x: headPosition.x - 1, y: headPosition.y };
        }
        if (directionY === 'down') {
            possibleMoves['down'] = { x: headPosition.x, y: headPosition.y - 1 };
        }
    }

    return possibleMoves;
}