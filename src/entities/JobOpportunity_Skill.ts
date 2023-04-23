import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";
import { Skill } from "./Skill";

@Entity('jobopportunity_skill')
export class JobOpportunity_Skill {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column({ type: 'int', comment: "" })
	weightingFactor: number

	@CreateDateColumn({ name: 'create_At' })
    createAt: Date

	@ManyToOne(() => JobOpportunity, (jobopportunity) => jobopportunity.jobopportunitySkills, { onDelete: "CASCADE" })
	@JoinTable()
	@JoinColumn({name: "FK_jobopportunityId"})
	jobopportunity: JobOpportunity

	@ManyToOne(() => Skill, (skill) => skill.jobopportunitySkills)
	@JoinTable()
	@JoinColumn({name: "FK_skillId"})
	skill: Skill
}