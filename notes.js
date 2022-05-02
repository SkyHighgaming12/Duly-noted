import { promises as fs } from "fs";


export async function saveNotes(notes) {
    if (!Array.isArray(notes)) {
        throw new Error("you suck");
      }
    await fs.writeFile("./data.json", JSON.stringify(notes, null, " "));
}   
export async function getNotes(){
    let jsonNotes;
    try{
        jsonNotes = await fs.readFile("./data.json");
    }catch (error){

    }
    const newNotes = JSON.parse(jsonNotes);
    return newNotes;

    
}