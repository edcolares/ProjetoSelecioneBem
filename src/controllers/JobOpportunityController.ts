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
        const { jobCode, title, level, openingDate, expectedDate, departmentId, useId } = req.body

        if (!jobCode || !title || !level || !openingDate || !expectedDate || !departmentId || !useId) {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' })
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
            const newJobOpportunity = jobopportunityRepository.create({ jobCode, title, level, openingDate, expectedDate, department, user })
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
        // console.log(idJobOpportunity);


        if (!Number.isInteger(Number(idJobOpportunity))) {
            return res.status(200).json({ message: 'Verique as chaves estrangeiras' })
        }
        // console.log('Chegou linha 98');

        try {

            const jobOpportunityData = await jobopportunityRepository.find({
                relations: {
                    jobopportunitySkills:
                    {
                        skill: true,
                    },
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
                },
                order: {
                    interviews: {
                        totalScore: "DESC",
                        ratings: {
                            skill: {
                                name: "ASC",
                            }
                        }
                    },
                    jobopportunitySkills: {
                        skill: {
                            name: "ASC",
                        }
                    },

                }
            })
            return res.status(200).json(jobOpportunityData)
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
    async getJobOpportunityByClosingDateOpen(req: Request, res: Response) {
        const { idUser } = req.params

        if (!idUser || !Number.isInteger(Number(idUser))) {
            return res.status(404).json({ message: 'Houve algum problema com a chave estrangeira passada por parametro.' })
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
                },
                order: {
                    expectedDate: "ASC",
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
     * Faz o fechamento da vaga, inserindo a data atual do sistema.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async setJobOpportunityClosed(req: Request, res: Response) {

        try {
            const { idJobOpportunity } = req.params
            const { useId, closingDate } = req.body.requestBody


            if (!idJobOpportunity || !Number.isInteger(Number(idJobOpportunity))) {
                return res.status(200).json({ message: 'Algum problema no parametro Id da oportunidade.' })
            }

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
                jobopportunityRepository.merge(objJobOpportunity, req.body.requestBody)
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

    async getVagasAbertasPorDepartamento(req: Request, res: Response) {
        try {

            const jobOpportunityStatistics = await jobopportunityRepository
                .createQueryBuilder("jobOpportunity")
                .select("department.name", "name_department")
                // .addSelect("CONCAT(EXTRACT(MONTH FROM jobOpportunity.openingDate), '-', EXTRACT(YEAR FROM jobOpportunity.openingDate))","month_year")
                .addSelect("EXTRACT(MONTH FROM jobOpportunity.openingDate)", "month")
                .addSelect("EXTRACT(YEAR FROM jobOpportunity.openingDate)", "year")
                .addSelect("COUNT(jobOpportunity.id)", "vacancy_open")
                .innerJoin("jobOpportunity.department", "department")
                .groupBy("department.name, EXTRACT(MONTH FROM jobOpportunity.openingDate), EXTRACT(YEAR FROM jobOpportunity.openingDate)")
                .orderBy("EXTRACT(YEAR FROM jobOpportunity.openingDate), EXTRACT(MONTH FROM jobOpportunity.openingDate), department.name")
                .getRawMany();
            return res.status(200).json(jobOpportunityStatistics);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Seleciona todas as entrevista e gera dados com relação a quaantidade total de oportunidades, oportunidade em aberto e 
     * fechadas e as concluidas com atraso.
     * @param req Request
     * @param res Response
     * @returns JSON com (open_opportunities, closed_opportunities, delayed_opportunities e all_opportunities)
     */
    async getJobOpportunitiesAllData(req: Request, res: Response) {
        const { idUser } = req.params;

        try {

            const jobOpportunityStatistics = await jobopportunityRepository
                .createQueryBuilder("jobOpportunity")
                .select("COUNT(CASE WHEN jobOpportunity.closingDate IS NULL THEN 1 END)", "open_opportunities")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate IS NOT NULL THEN 1 END)", "closed_opportunities")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate  > jobOpportunity.expectedDate THEN 1 END)", "delayed_opportunities")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate IS NULL AND jobOpportunity.expectedDate < CURRENT_DATE THEN 1 END)", "oportunidadeAbertasEmAtraso")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate IS NULL AND jobOpportunity.expectedDate >= CURRENT_DATE THEN 1 END)", "oportunidadeAbertasDentroPrazo")
                .addSelect("COUNT(jobOpportunity.id)", "all_opportunities")
                .where("jobOpportunity.FK_userId = :userId", { userId: Number(idUser) })
                .getRawMany();


            console.log(jobOpportunityStatistics);

            return res.status(200).json(jobOpportunityStatistics);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }


    /**
     * Seleciona todas as entrevista e gera dados com relação a quantidade total de oportunidades, oportunidade em aberto e 
     * fechadas e as fechadas com atraso.
     * @param req Request
     * @param res Response
     * @returns JSON com (oportunidades_abertas_global, fechadas_prazo_global, fechadas_atraso_global e all_opportunities)
     */
    async getJobOpportunitiesGlobal(req: Request, res: Response) {
        try {

            const jobOpportunityStatistics = await jobopportunityRepository
                .createQueryBuilder("jobOpportunity")
                .select("COUNT(CASE WHEN jobOpportunity.closingDate IS NULL THEN 1 END)", "oportunidades_abertas_global")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate <= jobOpportunity.expectedDate THEN 1 END)", "fechadas_prazo_global")
                .addSelect("COUNT(CASE WHEN jobOpportunity.closingDate > jobOpportunity.expectedDate THEN 1 END)", "fechadas_atraso_global")
                .addSelect("COUNT(jobOpportunity.id)", "all_opportunities")
                .getRawMany();
            return res.status(200).json(jobOpportunityStatistics);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }


    /**
    * 
    * @param req Request
    * @param res Response
    * @returns 
    */
    async getJobOpportunitiesMonthByUser(req: Request, res: Response) {

        try {
            const { idUser } = req.params;

            // Total de oportunidades ABERTAS dentro de cada MES
            const OportunidadesAbertasporMes = await jobopportunityRepository
                .createQueryBuilder("jobOpportunity")
                .select("EXTRACT(MONTH FROM jobOpportunity.openingDate)", "month")
                .addSelect("EXTRACT(YEAR FROM jobOpportunity.openingDate)", "year")
                .addSelect("COUNT(*) FILTER (WHERE jobOpportunity.openingDate IS NOT NULL)", "open_opportunities")
                .innerJoin("jobOpportunity.user", "user")
                .where("user.id = :idUser", { idUser })
                .groupBy("month, year")
                .orderBy("year, month")
                .getRawMany();

            // Total de oportunidades FECHADAS dentro de cada MES
            const OportunidadesFechadasporMes = await jobopportunityRepository
                .createQueryBuilder("jobOpportunity")
                .select("EXTRACT(MONTH FROM jobOpportunity.closingDate)", "month")
                .addSelect("EXTRACT(YEAR FROM jobOpportunity.closingDate)", "year")
                .addSelect("COUNT(*) FILTER (WHERE jobOpportunity.closingDate IS NOT NULL)", "closed_opportunities")
                .innerJoin("jobOpportunity.user", "user")
                .where("user.id = :idUser", { idUser })
                .groupBy("month, year")
                .orderBy("year, month")
                .getRawMany();


            // Combinar os resultados em um único array
            const combinedOpportunities = OportunidadesAbertasporMes.map(openOpportunity => {
                const { month, year } = openOpportunity;
                const closedOpportunity = OportunidadesFechadasporMes.find(closedOpportunity => closedOpportunity.month === month && closedOpportunity.year === year);
                const closed_opportunities = closedOpportunity ? closedOpportunity.closed_opportunities : '0';
                return {
                    month,
                    year,
                    open_opportunities: openOpportunity.open_opportunities,
                    closed_opportunities
                };
            });

            return res.status(200).json(combinedOpportunities);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}