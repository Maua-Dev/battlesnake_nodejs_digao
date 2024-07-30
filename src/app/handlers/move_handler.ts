import { Request, Response } from "express";
import { avoidMyNeck, avoidWallCollisions, firstAvailableMove, getKeys, possibleMoves, tryToEat, tryToKill } from "../utils/snake_logics";
import { Board } from "../types/board";
import { findClosestFood } from "../utils/specific_dir";
import { getRandomMove } from "../utils/get_random_move";

export async function moveHandler(req: Request, res: Response) {
  const DIRECTIONS = [ 'up', 'right', 'down', 'left'];

  try {
    const myHead = req.body.you.body[0];
    let myBoard = Board(req.body)
    let snakeSize = req.body.you.body.length
    const foods = req.body.board.food
    console.log('myBoard:')
    console.log(myBoard)
    const health = req.body.you.health
    let move = null
    
    let moves = possibleMoves(myHead)
    let newDirections = avoidMyNeck(myHead, req.body.you.body)
    newDirections = avoidWallCollisions(newDirections, req.body.board.width, req.body.board.height)
    if (snakeSize <= 4) {
      if (health < 37) {newDirections = findClosestFood(foods, myHead, newDirections)}
      if (health > 45 || health > 37) {
        const random = getRandomMove(myHead, req.body.you.body)
        const val = getKeys(random)
        const dir = getKeys(newDirections)
        const inSec = val.filter(value => dir.includes(value))

        if (inSec.length) {
          const changeDirections: { [val: string]: { x: number, y: number } } = {}

          inSec.forEach((value) => {
            changeDirections[value] = random[value]
          })

          newDirections = changeDirections
        } else {
          newDirections = random
        }
      } 
    }

    if (snakeSize >= 4) {
      newDirections = findClosestFood(foods, myHead, newDirections)
    }


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

    console.log('move AFTER TRY TO EAT:', move)

    if (!move) {
      move = tryToKill(myBoard, myHead, moves)
    }

    console.log('move AFTER TRY TO KILL:', move)

    if (!move) {
      move = tryToEat(myBoard, myHead, moves)
    }

    console.log('move AFTER TRY TO EAT 2:', move)

    if (!move) {
      move = firstAvailableMove(moves)
    }

    console.log('move AFTER FIRST AVAILABLE MOVE:', move)

    console.log('FINAL LOG move:', move)


    console.log('newDirections:', newDirections)

    const newDirectionKeys = getKeys(newDirections)
    let finallyMove = null
    if (newDirectionKeys.length && newDirectionKeys.includes(move)) {
      console.log('move:', move)
      newDirections = { [move]: newDirections[move] }
    } else {
      
      finallyMove = newDirectionKeys[Math.floor(Math.random() * newDirectionKeys.length)]
    }

    console.log('finallyMove:', finallyMove)

    return res.json({ move: finallyMove ? finallyMove : move })

  } catch (error: any) {
    console.error(error)
    res.status(500).send("Internal Server Error: " + error.message)
  }
}