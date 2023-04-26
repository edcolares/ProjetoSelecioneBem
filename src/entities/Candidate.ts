import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Interview } from "./Interview";

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 150 })
    name: string

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string

    @CreateDateColumn({ name: 'create_At', select: false })
    createAt: Date

    @UpdateDateColumn({ name: 'update_At', select: false })
    updateAt: Date

    @OneToMany(() => Interview, interview => interview.candidate)
    interviews: Interview[];
}