import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";
import { Interview } from "./Interview";

@Entity('rating')
export class Rating {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', comment: "" })
    score: number

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @ManyToOne(() => Interview, (interview) => interview.ratings, { onDelete: "CASCADE" })
    @JoinTable()
	interview: Interview

    @ManyToOne(() => Skill, (skill) => skill.ratings)
    @JoinTable()
	skill: Skill
}