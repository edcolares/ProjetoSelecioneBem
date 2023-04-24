import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";
import { Interview } from "./Interview";

@Entity('rating')
@Index('interview_skill_UNIQUE', ['interview', 'skill'], { unique: true })
export class Rating {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'int', comment: "" })
    score: number

    @CreateDateColumn({ name: 'create_At' })
    createAt: Date

    @ManyToOne(() => Interview, (interview) => interview.ratings, { onDelete: "CASCADE" })
    @JoinTable()
    @JoinColumn({ name: "FK_interviewId" })
    interview: Interview

    @ManyToOne(() => Skill, (skill) => skill.ratings, { eager: true })
    @JoinTable()
    @JoinColumn({ name: "FK_skillId" })
    skill: Skill
}