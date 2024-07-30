import { Request, Response } from "express";
import { collisionAvoider, findAllSnakes, floodFrom, foodSeeker, getHungry, getMoveOptions, getSmallestDistance, positionDiff, reduceAllSnakes, tailChaser, whatDir } from "../utils/snake_logics";
import lodash from 'lodash';

export async function moveHandler(req: Request, res: Response) {
  try {
    const {
      turn,
      board,
      food,
      you
    } = req.body

    console.log('turn:', turn)
    console.log('board:', board)
    console.log('food:', food)
    console.log('you:', you)

    const health = you.health
    const myBody = you.body
    const head = myBody[0]

    const allSnakes = findAllSnakes(board)
    const snakeObj = reduceAllSnakes(allSnakes)
    const snakeParts = positionDiff(allSnakes, myBody)
    let moveOptions = getMoveOptions(allSnakes, head, board.width, board.height)

    let newMoveOptions = lodash.filter(moveOptions, (move) => {
      return floodFrom(board.width, board.height, snakeObj, myBody.length + 5, move)
    })

    if (newMoveOptions.length === 0) {
      newMoveOptions = moveOptions
    } else {
      moveOptions = [lodash.sortBy(moveOptions, (move) => floodFrom(
        board.width, board.height, snakeObj, myBody.length, move
      ) * -1)[0]]
    }

    const headToSneak = getSmallestDistance(head, snakeParts)
    const hungry = turn < 10 ? 200 : getHungry(food)

    let myMove = 'up'
    if (headToSneak! <= 3) {
      myMove = collisionAvoider(moveOptions, snakeParts, myBody, head)
    } else if (health <= hungry && food.length > 0) {
      myMove = foodSeeker(moveOptions, food, head)
    } else {
      myMove = tailChaser(moveOptions, myBody, head)
    }

    if (moveOptions.length === 0) {
      myMove = whatDir(head, lodash.last(myBody))
    }

    return res.json({ move: myMove })

  } catch (error: any) {
    console.error(error)
    res.status(500).send("Internal Server Error: " + error.message)
  }
}