import { Request, Response } from "express";
import { candidateRepository } from "../repositories/candidateRepository";
import { interviewRepository } from "../repositories/interviewRepository";

export class CandidateController {

    /**
     * Function responsável pela criação de um novo candidato
     * @param req.body (name, email)
     * @param req Request
     * @param res Response
     * @returns Status em JSON
     */
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

    /**
     * Essa function tem por objetivo realizar uma busca por email em candidatos
     * @param req.body (email)
     * @param req Request
     * @param res Response
     * @returns Status por JSON
     */
    async findByEmail(req: Request, res: Response) {
        const { email } = req.params
        try {
            const candidate = await candidateRepository.findOneBy({ email: email })
            if (!candidate) {
                return res.status(404).json({ message: 'Não foi encontrado um candidato com o email informado.' })
            }
            return res.status(201).json(candidate)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Busca um candidato por email e todas as suas ENTREVISTAS
     * @param params email do candidato
     * @param req request
     * @param res Response
     * @returns Status por JSON com mensagem
     */
    async findByEmailWithInterviews(req: Request, res: Response) {
        const { email } = req.params

        try {

            const candidateInterviews = await candidateRepository.find({
                relations: {
                    interviews: {
                        ratings: {
                            skill: true,
                        },
                    },
                },
                where: {
                    email: email,
                },
            })
            return res.json(candidateInterviews)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Atualizar um candidato por id
     * @param req idCandidate
     * @param res Response
     * @returns res.send(results)
     */
    async update(req: Request, res: Response) {
        const { idCandidate } = req.params

        try {
            const candidate = await candidateRepository.findOneBy({ id: Number(idCandidate) })
            if (!candidate) {
                return res.status(404).json({ message: 'Não foi localizado nenhum registro.' })
            }
            candidateRepository.merge(candidate, req.body)
            const results = await candidateRepository.save(candidate)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

    /**
     * Tem por finalidade excluir um candidato que ainda não tenha participado de nenhuma
     * entrevista.
     * @param idCandidate Id do Candidato
     * @param req request
     * @param res response
     * @returns 
     */
    async delete(req: Request, res: Response) {
        const { idCandidate } = req.params

        const [candidateInterviews, candidateInterviewsCount] = await interviewRepository.findAndCount({
            relations: {
                candidate: true,
            },
            where: {
                candidate: {
                    id: Number(idCandidate)
                },
            },
        })
        try {
            if (candidateInterviewsCount === 0) {
                const candidate = await candidateRepository.findOneBy({
                    id: Number(idCandidate),
                })

                if (!candidate) {
                    return res.status(404).json({ message: 'Candidato não foi encontrado.' })
                }

                const results = await candidateRepository.remove(candidate)
                return res.status(200).json({ message: 'O candidato foi removido com sucesso.' })
            } else {
                return res.status(404).json({ message: 'Não é possível remover esse candidato' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }


}