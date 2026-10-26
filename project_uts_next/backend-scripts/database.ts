import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import {db} from "@/src/prisma/db";

export async function getDatabase(){
    return open({
        filename: path.join(process.cwd(), 'data/database.db'),
        driver: sqlite3.Database
    });
}

export async function getPrisma(){
    return db.orm.public;
}