import { Request, Response } from "express"

export async function baseHandler(req: Request, res: Response) {
  try {
    return res.json({ status: "ok" })
  } catch (error: any) {
    console.error(error)
    res.status(500).send("Internal Server Error: " + error.message)
  }
}