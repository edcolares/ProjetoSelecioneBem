import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rating')
export class Rating {
    @PrimaryGeneratedColumn()
	idRating: number
	
    @Column({ type: 'int', comment: "" })
	score: number
	
}