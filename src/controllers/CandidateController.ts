import { Request, Response, response } from "express";
import { candidateRepository } from "../repositories/candidateRepository";
import { cachedDataVersionTag } from "v8";

export class CandidateController {

    /** Cria um novo candidato */
    async create(req: Request, res: Response) {
        const { name, email } = req.body

        if (!name || !email) {
            return res.status(400).json({ message: 'Nome e email obrigatórios' })
        }

        try {
            const newCandidate = candidateRepository.create({ name, email })
            await candidateRepository.save(newCandidate)
            return res.status(201).json(newCandidate)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /** Listar candidatos por email */
    async findEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const candidate = await candidateRepository.findOneBy({ email: email })
            if (!candidate) {
                return res.status(404).json({ message: 'Não existe nenhum candidato com esse email cadastrado' })
            }
            res.json(candidate)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Desenvolver */
    async update() {
        
    }
}