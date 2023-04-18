import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Opportunity_Skill } from "./Opportunity_Skill";
import { Rating } from "./Rating";

@Entity('skill')
export class Skill {
	@PrimaryGeneratedColumn('increment')
	id: number

	@Column({ type: 'varchar', length: 130, comment: "" })
	name: string	

	@Column({ type: 'varchar', length: 50, comment: "" })
	type: string

	@OneToMany(() => Opportunity_Skill, opportunity_Skill => opportunity_Skill.skill)
	opportunitySkills: Opportunity_Skill[]

	@OneToMany(() => Rating, rating => rating.skill)
    ratings: Rating[]
}