import { Request, Response } from "express";
import { firstAvailableMove, possibleMoves, tryToEat, tryToKill } from "../utils/snake_logics";
import { Board } from "../types/board";

export async function moveHandler(req: Request, res: Response) {
  const DIRECTIONS = [ 'up', 'right', 'down', 'left'];

  try {
    const myHead = req.body.you.body[0];
    let myBoard = Board(req.body)
    console.log('myBoard:')
    console.log(myBoard)
    const health = req.body.you.health
    let move = null

    let moves = possibleMoves(myHead)

    for (const direction of DIRECTIONS) {
      if (direction === 'up') {
        let m = moves.up
        m.ok = myBoard.isOnBoard(m) && myBoard.canMoveTo(m);
      }
      if (direction === 'down') {
        let m = moves.down
        m.ok = myBoard.isOnBoard(m) && myBoard.canMoveTo(m);
      }
      if (direction === 'left') {
        let m = moves.left
        m.ok = myBoard.isOnBoard(m) && myBoard.canMoveTo(m);
      }
      if (direction === 'right') {
        let m = moves.right
        m.ok = myBoard.isOnBoard(m) && myBoard.canMoveTo(m);
      }
    }

    console.log('moves:', moves)

    if (health < 20) {
      move = tryToEat(myBoard, myHead, moves)
    }

    if (!move) {
      move = tryToKill(myBoard, myHead, moves)
    }

    if (!move) {
      move = tryToEat(myBoard, myHead, moves)
    }

    if (!move) {
      move = firstAvailableMove(moves)
    }

    console.log('FINAL LOG move:', move)

    return res.json({ move: move.dir })

  } catch (error: any) {
    console.error(error)
    res.status(500).send("Internal Server Error: " + error.message)
  }
}