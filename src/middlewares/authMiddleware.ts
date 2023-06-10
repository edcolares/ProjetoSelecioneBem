import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";


type JwtPayload = {
  id: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  console.log("Valor de AUTHORIZATION: ", authorization);

  if (!authorization) {
    return res.status(404).json({ message: "Não autorizado" });
  }

  const token = authorization.split(' ')[1];

  const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;


  const user = await userRepository.findOneBy({ id });

  if (!user) {
    return res.status(404).json({ message: "Não autorizado" });
  }

  const { password: pwd, ...loggedUser } = user;

  req.user = loggedUser

  next()
};