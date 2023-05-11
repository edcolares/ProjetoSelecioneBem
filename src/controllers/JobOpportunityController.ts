import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";
import { departmentRepository } from "../repositories/departmentRepository";
import { IsNull } from "typeorm";

export class JobOpportunityController {

    /**
     * Essa função cria e salva uma nova oportunidade de emprego no banco de dados a partir
     * dos dados enviados na requisição HTTP. Se ocorrer algum erro, a função retorna um 
     * erro 500. Em caso de sucesso, retorna a nova oportunidade de emprego criada.
     * @param req.body { title, level, openingDate, expectedDate, departmentId, useId }
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async create(req: Request, res: Response) {
        const { title, level, openingDate, expectedDate, departmentId, useId } = req.body

        if (!title || !level || !openingDate || !expectedDate || !departmentId || !useId) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente.' })
        }

        const department = await departmentRepository.findOneBy({ id: Number(departmentId) })
        const user = await userRepository.findOneBy({ id: Number(useId) })

        if (!department || !user) {
            return res.status(404).json({ message: 'Alguma chave estrangeira não foi localizada.' })
        }

        if (user.isActive == false) {
            return res.status(404).json({ message: 'O usuário está inativo, a transação foi cancelada' })
        }

        try {
            const newJobOpportunity = jobopportunityRepository.create({ title, level, openingDate, expectedDate, department, user })
            await jobopportunityRepository.save(newJobOpportunity)
            return res.status(200).json(newJobOpportunity)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /**
     * Function que irá listar todas as jobopportunity e jobopportunity_skill dela
     * através do ID de um usuário
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async listByUser(req: Request, res: Response) {
        const { idUser } = req.params

        if (!Number.isInteger(Number(idUser))) {
            return res.status(400).json({ message: 'Verifique o id do usuário, tipo de dado incorreto.' })
        }

        try {
            const JobAll = await jobopportunityRepository.find({
                relations: {
                    department: true,
                    jobopportunitySkills: {
                        skill: true,
                    },
                },
                where: {
                    user: {
                        id: Number(idUser),
                    }
                },
            })
            return res.status(200).json(JobAll)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Busca todas as INTERVIWES de uma determinada JOBOPPORTUNITY
     * @param req.params idJobOpportunity
     * @param req request
     * @param res response
     * @returns JSON
     */
    async getInterviewsByJobOpportunity(req: Request, res: Response) {
        const { idJobOpportunity } = req.params
        const { idUser } = req.body

        if (!Number.isInteger(Number(idJobOpportunity)) || !Number.isInteger(Number(idUser))) {
            return res.status(200).json({ message: 'Verique as chaves estrangeiras' })
        }

        try {

            const interviewsByUser = await jobopportunityRepository.find({
                relations: {
                    interviews: {
                        candidate: true,
                        ratings: {
                            skill: true,
                        },
                    },
                    department: true,
                },
                where: {
                    id: Number(idJobOpportunity),
                    user: {
                        id: Number(idUser)
                    },
                }
            })
            return res.status(200).json(interviewsByUser)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Busca todas as JOBOPPORTUNITY abertas de um User
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async find(req: Request, res: Response) {
        const { idUser } = req.params

        if (!idUser || !Number.isInteger(Number(idUser))) {
            return res.status(404).json({ message: 'Houve algum problema com a chave estrangeira passad por parametro.' })
        }

        try {
            const jobopportunityOpenByUser = await jobopportunityRepository.find({
                relations: {
                    department: true,
                    jobopportunitySkills: {
                        skill: true,
                    },
                },
                where: {
                    closingDate: IsNull(),
                    user: {
                        id: Number(idUser),
                    }
                }
            })
            return res.status(200).json(jobopportunityOpenByUser)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    async getJobOpportunityById(req: Request, res: Response) {
        const { idJobOpportunity } = req.params
        if (!idJobOpportunity || !Number.isInteger(Number(idJobOpportunity))) {
            return res.status(404).json({ message: 'A oportunidade de emprego não foi localizada!' })
        }
        try {
            const jobOpportunityById = await jobopportunityRepository.findOne({
                relations: {
                    department: true,
                    jobopportunitySkills: {
                        skill: true,
                    },
                },
                where: {
                    id: Number(idJobOpportunity),
                },
            })
            return res.status(200).json(jobOpportunityById);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }


    /**
     * Essa função tem a finalidade de atualizar dados de uma JOBOPPORTUNITY, 
     * desde que seja o mesmo usuário que a criou
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async update(req: Request, res: Response) {
        const { idJobOpportunity } = req.params
        const { title, level, openingDate, expectedDate, closingDate, departmentId, useId } = req.body

        if (!useId || !Number.isInteger(Number(useId))) {
            return res.status(200).json({ message: 'O usuário tem que ser identificado.' })
        }

        if (!idJobOpportunity || !Number.isInteger(Number(idJobOpportunity))) {
            return res.status(200).json({ message: 'Algum problema no parametro Id da oportunidade.' })
        }

        try {
            const objJobOpportunity = await jobopportunityRepository.findOne({
                relations: {
                    user: true,
                },
                where: {
                    id: Number(idJobOpportunity),
                },
            })
            if (!objJobOpportunity) {
                return res.status(404).json({ message: 'Não existe oportunidades cadastradas' })
            }
            if (objJobOpportunity.user.id === Number(useId)) {
                jobopportunityRepository.merge(objJobOpportunity, req.body)
                const results = await jobopportunityRepository.save(objJobOpportunity)
                return res.status(200).json(results)
            } else {
                return res.status(404).json({ message: 'Somente o mesmo usuário poderá realizar a manutenção dos dados.' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /**
     * Esta função deleta uma oportunidade de emprego do banco de dados. Ela recebe um 
     * ID de oportunidade na requisição HTTP, verifica se a oportunidade existe e, se 
     * existir, remove-a do banco de dados. Em caso de sucesso, a função retorna o 
     * resultado da operação, caso contrário, retorna um erro.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async delete(req: Request, res: Response) {
        const { idJobOpportunity } = req.params

        try {
            const jobopportunity = await jobopportunityRepository.findOneBy({
                id: Number(idJobOpportunity),
            })

            if (!jobopportunity) {
                return res.status(404).json({ message: 'Oportunidade não foi encontrada.' })
            }

            const results = await jobopportunityRepository.remove(jobopportunity)
            return res.status(200).json(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

}