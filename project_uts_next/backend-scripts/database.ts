import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export async function getDatabase(){
    return open({
        filename: path.join(process.cwd(), 'data/database.db'),
        driver: sqlite3.Database
    });
}