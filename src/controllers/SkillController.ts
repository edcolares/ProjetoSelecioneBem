import { Request, Response } from "express";
import { skillRepository } from "../repositories/skillRepository";

export class SkillController {

    /**
     * A função cria uma nova habilidade no banco de dados, verificando se os campos 
     * obrigatórios foram preenchidos corretamente. Em caso de sucesso, retorna a 
     * nova habilidade criada. Em caso de erro, retorna um erro 500.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async create(req: Request, res: Response) {
        const { name, type } = req.body

        if (!name || !type || name.trim() === '' || type.trim() === '') {
            return res.status(404).json({ message: 'Todos os campos são obrigatórios' })
        }

        try {
            const newSkill = skillRepository.create({ name, type })
            await skillRepository.save(newSkill)
            return res.status(200).json(newSkill)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * A função busca todas as habilidades cadastradas e retorna um JSON com a lista de 
     * habilidades. Em caso de erro, retorna uma mensagem de erro 500.
     * @param req request
     * @param res response
     * @returns JSON
     */
    async find(req: Request, res: Response) {

        try {
            const skill = await skillRepository.find({
                order: {
                    type: "ASC",
                    name: "ASC",
                },
            })
            if (!skill) {
                return res.status(404).json({ message: 'Não possui nenhuma skill cadastrada.' })
            }
            return res.status(200).json(skill)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Essa função atualiza as informações de uma skill no banco de dados a partir do seu id. 
     * Ela verifica se a skill existe, realiza a atualização e retorna o resultado em formato 
     * JSON.
     * @param req Request
     * @param res Response
     * @returns JSON
     */
    async update(req: Request, res: Response) {
        const { idSkill } = req.params

        try {
            const skill = await skillRepository.findOneBy({ id: Number(idSkill) })
            if (!skill) {
                return res.status(404).json({ message: 'Não foi encontrado nenhum candidato' })
            }
            skillRepository.merge(skill, req.body)
            const results = await skillRepository.save(skill)
            return res.status(200).json(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }

    }

    /**
     * Essa função deleta uma skill do banco de dados, porém só é realizada a exclusão se não 
     * houver dependência da skill em outras tabelas. Se a skill não for encontrada, uma 
     * mensagem de erro é retornada.
     * @param req request
     * @param res response
     * @returns JSON
     */
    async delete(req: Request, res: Response) {
        const { idSkill } = req.params

        try {
            const skill = await skillRepository.findOneBy({
                id: Number(idSkill),
            })

            if (!skill) {
                return res.status(404).json({ message: 'Não foi possível excluir a informação solicitada pois não foi encontrada no banco de dados' })
            }

            const results = await skillRepository.remove(skill)
            return res.status(200).json(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })
        }
    }

}