import { Request, Response } from "express";
import { candidateRepository } from "../repositories/candidateRepository";
import { interviewRepository } from "../repositories/interviewRepository";

export class CandidateController {

    /** Cria um novo candidato */
    async create(req: Request, res: Response) {
        const { name, email } = req.body

        if (!name || !email || name.trim() === '' || email.trim() === '') {
            return res.status(400).json({ message: 'Nome e email são campos obrigatórios' })
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

    /** Busca um CANDIDATO por seu e-mail de cadastro */
    async findByEmail(req: Request, res: Response) {
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

    /** Listar um CANDIDATO e todas as suas ENTREVISTAS  */
    async findByEmailWithInterviews(req: Request, res: Response) {
        const { email } = req.params
        console.log(email)

        try {
            const candidate = await candidateRepository.findOneBy({ email: email })
            console.log('id Candidato' + candidate?.id);
            
            const interviews = await interviewRepository.find({
                where: {
                    candidate: {id: candidate?.id}
                },
                relations: ['candidate']
            })
            res.json(interviews)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /** Desenvolver */
    async update(req: Request, res: Response) {
        const { id } = req.body

        try {
            const candidate = await candidateRepository.findOneBy({ id: Number(id) })
            if (!candidate) {
                return res.status(404).json({ message: 'Não existe nenhum candidato com esse email cadastrado' })
            }
            candidateRepository.merge(candidate, req.body)
            const results = await candidateRepository.save(candidate)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /******************************* DELETAR *******************************/
    async delete(req: Request, res: Response) {
        const { idCandidate } = req.params

        try {
            const candidate = await candidateRepository.findOneBy({
                id: Number(idCandidate),
            })

            if (!candidate) {
                return res.status(404).json({ message: 'Candidato não foi encontrado.' })
            }

            const results = await candidateRepository.remove(candidate)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }


}