import { Request, Response } from "express";
import { departmentRepository } from "../repositories/departmentRepository";
import { jobopportunityRepository } from "../repositories/jobopportunityRepository";

export class DepartmentController {

    /**
     * Function tem por objetivo inserir um novo departamento
     * @param req Request
     * @param res Response
     * @returns res.Status(201).json()
     */
    async create(req: Request, res: Response) {
        const { name, manager, email } = req.body

        if (!name || !email || !manager || name.trim() === '' || email.trim() === '' || manager.trim() === '') {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
        }

        try {
            const newDepartment = departmentRepository.create({ name, manager, email })
            await departmentRepository.save(newDepartment)
            return res.status(201).json(newDepartment)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /**
     * Function irá listar todos os departamentos ativos
     * @param req Request
     * @param res Response
     * @returns return res.status(200).json()
     */
    async find(req: Request, res: Response) {

        try {
            const department = await departmentRepository.find({
                where: {
                    isActive: true,
                },
                order: {
                    name: "ASC",
                }
            })
            if (!department) {
                return res.status(404).json({ message: 'Não possui nenhum departamento cadastrado' })
            }
            res.json(department)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Function tem por finalidade atualizar as informações de um departamento
     * @param req request
     * @param res response
     * @returns JSON
     */
    async update(req: Request, res: Response) {
        const { idDepartment } = req.params

        try {
            const department = await departmentRepository.findOneBy({ id: Number(idDepartment) })
            if (!department) {
                return res.status(404).json({ message: 'Não foi encontrado nenhum candidato' })
            }
            departmentRepository.merge(department, req.body)
            const results = await departmentRepository.save(department)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    /**
     * Exclui um registro se não houver dependencia na tabela entrevistas
     * @param req 
     * @param res 
     * @returns 
     * Não consegui testar, está dando erro
     */
    async delete(req: Request, res: Response) {
        const { idDepartment } = req.params

        try {
            const department = await departmentRepository.findOneBy({
                id: Number(idDepartment),
            })

            if (!department) {
                return res.status(404).json({ message: 'Não encontramos nenhum dado.' })
            }

            const results = await departmentRepository.remove(department)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }


    async getDepartmentStatistics(req: Request, res: Response) {
        try {

            const departmentStatistics = await departmentRepository
                .createQueryBuilder("department")
                .select("department.name", "name")
                .addSelect("MAX(jobOpportunity.level)", "nivel")
                .addSelect("COUNT(jobOpportunity.id)", "qtde_oportunidades")
                .leftJoinAndSelect("department.jobopportunities", "jobOpportunity", "jobOpportunity.FK_departmentId = department.id")
                .groupBy("department.name")
                .getRawMany();
            return res.status(200).json(departmentStatistics);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}