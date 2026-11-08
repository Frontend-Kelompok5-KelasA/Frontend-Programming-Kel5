import { db } from "@/src/prisma/db";

export function getPrisma(){
    return db.orm.public;
}

export function getRawPrisma(){
    return db;
}