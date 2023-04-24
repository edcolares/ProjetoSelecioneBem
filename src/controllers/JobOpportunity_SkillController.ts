import { Request, Response } from "express"
import { jobopportunityRepository } from "../repositories/jobopportunityRepository"
import { jobopportunity_skillRepository } from "../repositories/jobopportunity_skillRepository"
import { skillRepository } from "../repositories/skillRepository"
import { Skill } from "../entities/Skill"
import { JobOpportunity_Skill } from "../entities/JobOpportunity_Skill"
import { Interview } from "../entities/Interview"
import { Rating } from "../entities/Rating"


export class JobOpportunity_SkillController {

    /** Cria uma nova JobOpportunity_Skill
     * Parametro: Irá receber o idJobOpportunity por parametro de URL
     * e no body vai receber dois campos, weightingFactor, FK_skillId
     */
    async create(req: Request, res: Response) {

        const { weightingFactor, FK_skillId } = req.body
        const { idJobOpportunity } = req.params
        if (!weightingFactor || !FK_skillId || !idJobOpportunity) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const jobOpportunity = await jobopportunityRepository.findOneBy({ id: Number(idJobOpportunity) })
        const skillId = await skillRepository.findOneBy({ id: Number(FK_skillId) })

        if (!jobOpportunity || !skillId) {
            return res.status(404).json({ message: 'A oportunidade de emprego ou a skill já deve estar cadastrada, revise.' })
        }


        try {
            const newJobOpportunity_Skill = jobopportunity_skillRepository.create({ weightingFactor, jobopportunity: jobOpportunity, skill: skillId })
            await jobopportunity_skillRepository.save(newJobOpportunity_Skill)
            return res.status(201).json(newJobOpportunity_Skill)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /**
     * Essa função tem por finalidade a exclusão de um JobOpportunity_Skill
     * somente se ele não tiver uma ENTREVISTA que possua um RATING atribuido
     * para a mesma SKILL
     * @param req request
     * @param res response
     * @returns Irá retornar uma mensagem por JSON
     */
    async delete(req: Request, res: Response) {
        const { idJobOpportunity_Skill } = req.params

        if (!idJobOpportunity_Skill) {
            return res.status(400).json({ message: "O id não foi encontrado" })
        }

        const jobOpportunity_Skill = await jobopportunity_skillRepository.findOneBy({ id: Number(idJobOpportunity_Skill) })
        const idJobOport = jobOpportunity_Skill?.jobopportunity


        const jobOpportunity_Contain_Interview = await jobopportunityRepository
            .createQueryBuilder("jo")
            .innerJoinAndSelect(JobOpportunity_Skill, "jos", "jo.id = jos.FK_jobopportunityId")
            .innerJoinAndSelect(Skill, "s", "jos.FK_skillId = s.id")
            .innerJoin(Interview, "i", "jo.id = i.FK_jobopportunityId")
            .innerJoin(Rating, "r", "i.id = r.FK_interviewId AND s.id = r.FK_skillId")
            .where("jo.id = :jobOpportunityId", { jobOpportunityId: 2 })
            .andWhere("s.id = 2")
            .getMany();


        res.json(jobOpportunity_Contain_Interview)

    }
}