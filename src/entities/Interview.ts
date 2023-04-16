import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity('interview')
export class Interview {
    @PrimaryGeneratedColumn()
    idInterview: number

    @Column({ type: 'timestamp without time zone' })
    startDate: Date

    @Column({ type: 'timestamp without time zone' })
    finishDate: Date

    @Column({ type: 'boolean' })
    delay: boolean

    @Column({ type: 'time' })
    duration: Timestamp

    @Column({ type: 'int' })
    totalScore: number

    @Column({ type: 'varchar', length: 1024, nullable: true })
    note: string    

}