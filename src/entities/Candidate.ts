import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('candidate')
export class Candidate {
    @PrimaryGeneratedColumn()
    idCandidate: number

    @Column({ type: 'varchar', length: 150 })
    name: string

    @Column({ type: 'varchar', length: 150, unique:true })
    email: string
}