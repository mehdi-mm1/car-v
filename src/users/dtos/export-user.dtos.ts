import { Expose } from "class-transformer";

export class ExportUserDto {
    @Expose()
    id: number;

    @Expose()
    email:string;
}