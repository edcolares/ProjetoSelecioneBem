import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";

export class UserController {

    /** Cria um novo candidato */
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body

        if (!name || !email || !password || name.trim() === '' || email.trim() === '' || password.trim() === '') {
            return res.status(400).json({ message: 'Algo não foi preenchido corretamente' })
        }

        try {
            const newUser = userRepository.create({ name, email, password })
            await userRepository.save(newUser)
            return res.status(201).json(newUser)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /** Listar candidatos por email */
    async findEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const user = await userRepository.findOneBy({ email: email })
            if (!user) {
                return res.status(404).json({ message: 'Não existe nenhum candidato com esse email cadastrado' })
            }
            res.json(user)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const user = await userRepository.findOneBy({ id: Number(id) })
            if (!user) {
                return res.status(404).json({ message: 'Não existe nenhum candidato com esse email cadastrado' })
            }
            userRepository.merge(user, req.body)
            const results = await userRepository.save(user)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /******************************* DELETAR *******************************/
    async delete(req: Request, res: Response) {
        const { idUser } = req.params

        try {
            const user = await userRepository.findOneBy({
                id: Number(idUser),
            })

            if (!user) {
                return res.status(404).json({ message: 'Usuário não foi encontrado.' })
            }

            user.isActive = false;
            user.removeAt = new Date();
            const results = await userRepository.save(user);
            return res.send(results)
                        
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

}