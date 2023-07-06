import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity } from "./JobOpportunity";
import { Skill } from "./Skill";

@Entity('jobopportunity_skill')
@Index('jobopportunity_skill_UNIQUE', ['jobopportunity', 'skill'], { unique: true })
export class JobOpportunity_Skill {
	@PrimaryGeneratedColumn('increment', {
		comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
		primaryKeyConstraintName: "PK_JobOpportunitySkill_Id"
	})
	id: number

	@Column({
		type: 'int',
		default: 0,
		comment: "Fator de ponderação para a habilidade em uma oportunidade de trabalho."
	})
	weightingFactor: number

	@CreateDateColumn({
		name: 'create_At',
		select: false,
		comment: "Data de criação do registro."
	})
	createAt: Date

	@ManyToOne(() => JobOpportunity, (jobopportunity) => jobopportunity.jobopportunitySkills, { onDelete: "CASCADE" })
	@JoinColumn({
		name: "FK_jobopportunityId",
		foreignKeyConstraintName: "FK_constraint_jobOpportunityId_jobopportunitySkills"
	})
	jobopportunity: JobOpportunity;

	@ManyToOne(() => Skill, (skill) => skill.jobopportunitySkills)
	@JoinColumn({
		name: "FK_skillId",
		foreignKeyConstraintName: "FK_constraint_skillId_jobopportunitySkills"
	})
	skill: Skill;
}