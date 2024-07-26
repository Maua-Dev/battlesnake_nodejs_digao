import { Request, Response } from "express"

export async function baseHandler(req: Request, res: Response) {
  try {
    return res.json({
      apiversion: "1",
      author: "~ Digao the Evil One ~",
      color: "#6666ff",
      head: "evil",
      tail: "flake",
      version: "1.0.0"
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).send("Internal Server Error: " + error.message)
  }
}