import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('skill')
export class Skill {
	@PrimaryGeneratedColumn()
	idSkill: number

	@Column({ type: 'varchar', length: 130, comment: "" })
	name: string

	@Column({ type: 'varchar', length: 50, comment: "" })
	type: string
}