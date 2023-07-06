import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobOpportunity_Skill } from "./JobOpportunity_Skill";
import { Rating } from "./Rating";

@Entity('skill')
export class Skill {
	@PrimaryGeneratedColumn('increment', {
		comment: "Identificador único e sequencial, atribuído pelo banco de dados.",
		primaryKeyConstraintName: "PK_Skill_Id"
	})
	id: number;

	@Column({
		type: 'varchar',
		length: 130,
		comment: "Nome da habilidade."
	})
	name: string;

	@Column({
		type: 'varchar',
		length: 50,
		comment: "Tipo da habilidade."
	})
	type: string;

	@OneToMany(() => JobOpportunity_Skill, jobopportunity_Skill => jobopportunity_Skill.skill)
	jobopportunitySkills: JobOpportunity_Skill[];

	@OneToMany(() => Rating, rating => rating.skill)
	ratings: Rating[];
}
