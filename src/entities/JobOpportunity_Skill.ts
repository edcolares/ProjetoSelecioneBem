import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";
import { Skill } from "./Skill";

@Entity('jobopportunity_skill')
@Index('jobopportunity_skill_UNIQUE', ['jobopportunity', 'skill'], { unique: true })
export class JobOpportunity_Skill {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column({ type: 'int' , default: 0})
	weightingFactor: number

	@CreateDateColumn({ name: 'create_At', select: false })
	createAt: Date

	@ManyToOne(() => JobOpportunity, (jobopportunity) => jobopportunity.jobopportunitySkills, { onDelete: "CASCADE" })
	@JoinColumn({ name: "FK_jobopportunityId" })
	jobopportunity: JobOpportunity;

	@ManyToOne(() => Skill, (skill) => skill.jobopportunitySkills)
	@JoinColumn({ name: "FK_skillId" })
	skill: Skill;

}