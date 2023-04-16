import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('opportunity')
export class Opportunity {
    @PrimaryGeneratedColumn()
    idOpportunity: number

    @Column({ type: 'varchar', length: 254 })
    title: string

    @Column({ type: 'varchar', length: 50 })
    level: string

    @Column({ type: 'date' })
    openingDate: Date

    @Column({ type: 'date', nullable: true })
    expectedDate: Date

    @Column({ type: 'date', nullable: true })
    closingDate: Date

}