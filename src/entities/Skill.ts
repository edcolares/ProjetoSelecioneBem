import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity_Skill } from "./JobOpportunity_Skill";
import { Rating } from "./Rating";

@Entity('skill')
export class Skill {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column({ type: 'varchar', length: 130, comment: "" })
	name: string	

	@Column({ type: 'varchar', length: 50, comment: "" })
	type: string

	@OneToMany(() => JobOpportunity_Skill, jobopportunity_Skill => jobopportunity_Skill.skill)
	jobopportunitySkills: JobOpportunity_Skill[]

	@OneToMany(() => Rating, rating => rating.skill)
    ratings: Rating[]
}