import { Request, Response } from "express"
import { jobopportunityRepository } from "../repositories/jobopportunityRepository"
import { jobopportunity_skillRepository } from "../repositories/jobopportunity_skillRepository"
import { skillRepository } from "../repositories/skillRepository"
import { Skill } from "../entities/Skill"
import { JobOpportunity_Skill } from "../entities/JobOpportunity_Skill"
import { Interview } from "../entities/Interview"
import { Rating } from "../entities/Rating"
import { TreeLevelColumn } from "typeorm"


export class JobOpportunity_SkillController {

    /** Cria uma nova JobOpportunity_Skill
     * Parametro: Irá receber o idJobOpportunity por parametro de URL
     * e no body vai receber dois campos, weightingFactor, FK_skillId
     */
    async create(req: Request, res: Response) {

        const { skillId } = req.body
        const { idJobOpportunity } = req.params

        if (!skillId || !idJobOpportunity) {
            return res.status(400).json({ message: 'Campos não foram preenchidos corretamente' })
        }

        const jobOpportunity = await jobopportunityRepository.findOneBy({ id: Number(idJobOpportunity) })
        const skillFind = await skillRepository.findOneBy({ id: Number(skillId) })

        if (!jobOpportunity || !skillFind) {
            return res.status(404).json({ message: 'A oportunidade de emprego ou a skill já deve estar cadastrada, revise.' })
        }


        try {
            const newJobOpportunity_Skill = jobopportunity_skillRepository.create({ jobopportunity: jobOpportunity, skill: skillId })
            await jobopportunity_skillRepository.save(newJobOpportunity_Skill)
            return res.status(201).json(newJobOpportunity_Skill)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })

        }
    }

    /**
     * Essa função tem por finalidade a exclusão de um JobOpportunity_Skill
     * somente se ela não tiver uma ENTREVISTA que possua um RATING atribuido
     * para a mesma SKILL
     * @param req request
     * @param res response
     * @returns Irá retornar uma mensagem por JSON
     */
    async delete(req: Request, res: Response) {
        const { idJobOpportunity_Skill } = req.params

        if (!idJobOpportunity_Skill) {
            return res.status(400).json({ message: "O id não foi passado por parametro" })
        }

        // console.log("Parametro >> " + Number(idJobOpportunity_Skill));

        try {

            const jobOpportunities = await jobopportunityRepository
                .createQueryBuilder('jo')
                .leftJoinAndSelect('jo.jobopportunitySkills', 'jos')
                .leftJoinAndSelect('jos.skill', 's')
                .where('jos.id = :jobId', { jobId: idJobOpportunity_Skill })
                .getMany();

            const idOportunidade = jobOpportunities[0].id
            const idSkill = jobOpportunities[0].jobopportunitySkills[0].skill.id

            console.log("Valor de idOpportunidade-> " + idOportunidade);
            console.log("Valor de idSkill-> " + idSkill);

            const jobOpportunity_Contain_Interview = await jobopportunityRepository
                .createQueryBuilder("jo")
                .innerJoinAndSelect(JobOpportunity_Skill, "jos", "jo.id = jos.FK_jobopportunityId")
                .innerJoinAndSelect(Skill, "s", "jos.FK_skillId = s.id")
                .innerJoin(Interview, "i", "jo.id = i.FK_jobopportunityId")
                .innerJoin(Rating, "r", "i.id = r.FK_interviewId AND s.id = r.FK_skillId")
                .where("jo.id = :jobOpportunityId", { jobOpportunityId: idOportunidade })
                .andWhere("s.id = :skillId", { skillId: idSkill })
                .getMany();

            if (jobOpportunity_Contain_Interview.length === 0) {
                console.log("Pode deletar, não foi encontrado nenhum rating para essa JobOpportunity")

                const id_JobOpport_Skill = new JobOpportunity_Skill()
                id_JobOpport_Skill.id = Number(idJobOpportunity_Skill)

                const results = await jobopportunity_skillRepository.remove(id_JobOpport_Skill)
                return res.send(results)

            } else {
                console.log("Não pode deletar a JobOpportunity_Skill, já existe um rating para essa Skill")

                return res.send(jobOpportunity_Contain_Interview)
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Function responsável pela atualização/manutencção dos dados de uma 
     * JobOpportunity_Skill,
     * @param idJobOpportunity_Skill Espera-se receber o Id
     * @param weightingFactor Único campo para atualização do factor de peso (Valida Número Inteiro)
     * @param req Request
     * @param res Response
     */
    async update(req: Request, res: Response) {
        const { idJobOpportunity_Skill } = req.params
        const { weightingFactor } = req.body

        if (!Number.isInteger(Number(weightingFactor)) || !weightingFactor) {
            return res.status(400).json({ message: 'Campo weightingFactor foi preenchido incorretamente' })
        }

        try {

            const newJobOpportunity_Skill = new JobOpportunity_Skill()
            newJobOpportunity_Skill.id = Number(idJobOpportunity_Skill)
            newJobOpportunity_Skill.weightingFactor = weightingFactor

            const jobOpportunity_Skill = await jobopportunity_skillRepository.findOneBy({ id: Number(idJobOpportunity_Skill) })
            if (!jobOpportunity_Skill) {
                return res.status(404).json({ message: 'Não foi possível localizar o registro' })
            }
            jobopportunity_skillRepository.merge(jobOpportunity_Skill, newJobOpportunity_Skill)
            const results = await jobopportunity_skillRepository.save(jobOpportunity_Skill)
            return res.send(results)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Sever Error' })

        }
    }

    async findByIdofJobOpportunitySkill(req: Request, res: Response) {
        const { idJobOpportunity } = req.params
        try {
            const find = await jobopportunity_skillRepository.find({
                relations: {
                    skill: true,
                },
                where: {
                    jobopportunity: {
                        id: Number(idJobOpportunity),
                    }
                },
                order: {
                    skill: {
                        type: 'ASC',
                        name: 'ASC',
                    }
                }
            })
            return res.status(200).json(find)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    /**
     * Tem por objetivo contar quantas vezes cada habilidade aparece nos registros,
     * agrupa por nome e as ordena pelo número de ocorrências em ordem decrescente.
     * Foi limitado a 10 habilidades mais usadas.
     * @param req None
     * @param res JSON
     * @returns 
     */
    async getTop10(req: Request, res: Response) {
        try {
            const results = await jobopportunity_skillRepository
                .createQueryBuilder("j")
                .select("s.name, COUNT(*) AS count")
                .leftJoin(Skill, "s", 'j."FK_skillId" = s.id')
                .groupBy("s.name")
                .orderBy("count", "DESC")
                .limit(10)
                .getRawMany();
            return res.status(200).json(results);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }


    async getSoftVSHard(req: Request, res: Response) {
        try {
            // const results = await jobopportunity_skillRepository
            //     .createQueryBuilder("j")
            //     .select('s.type, COUNT(*) AS count')
            //     .leftJoin(Skill, "s", 'j."FK_skillId" = s.id')
            //     .groupBy('s.type')
            //     .orderBy('count', 'DESC')
            //     .getRawMany();

            const results = await skillRepository
                .createQueryBuilder()
                .select("skill.type", "type")
                .addSelect("COUNT(*)", "count")
                .from(JobOpportunity_Skill, "jobopportunity_skill")
                .innerJoin("jobopportunity_skill.skill", "skill")
                .groupBy("skill.type")
                .orderBy("count", "DESC")
                .getRawMany();


            // .createQueryBuilder("j")
            // .innerJoinAndSelect("j.skill", "s")
            // .select("s.type", "type")
            // .addSelect("COUNT(*)", "count")
            // .groupBy("s.type")
            // .orderBy("count", "DESC")
            // .getRawMany();

            // .createQueryBuilder('j')
            // .select('s.type', 'type')
            // .addSelect('COUNT(*)', 'count')
            // .innerJoin(`${Number("j.FK_skillId")}`, `${Number("s.id")}`)
            // .groupBy('s.type')
            // .orderBy('count', 'DESC');

            // const count = await dataSource
            //     .getRepository(User)
            //     .createQueryBuilder("user")
            //     .where("user.name = :name", { name: "Timber" })
            //     .getCount()

            return res.status(200).json(results);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}
    /**
* Tem por objetivo contar quantas vezes cada habilidade aparece nos registros,
* agrupa por nome e as ordena pelo número de ocorrências em ordem decrescente.
* Foi limitado a 10 habilidades mais usadas.
* @param req None
* @param res JSON
* @returns 
*/