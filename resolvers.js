import { UserInputError } from "apollo-server";
import cuid from "cuid";
import { isSelectionNode } from "graphql";
import { saveNotes, getNotes} from './notes.js';

let savedNotes = [];
export default {
    Mutation: {
        async createNote(_, args){
            savedNotes = await getNotes();

            const { note } = args;

            const newNote = { ...note };
        
            if (!newNote.id) {
                newNote.id = cuid();
            }

            if (!newNote.createdAt) {
                const now = new Date();
                newNote.createdAt = now.toISOString();
            }

            if (!newNote.updateAt) {
                const now = new Date();
                newNote.updatedAt = now.toISOString();
            }

            if (typeof newNote.isArchived !== "boolean") {
                newNote.isArchived = false;
            }

            savedNotes.push(newNote);

            await saveNotes(savedNotes);
            return newNote;
        },
        async updateNote(_, args){
            savedNotes = await getNotes();

            const { note, id } = args;

            const selectedNote = savedNotes.find((note) => note.id === id);

            const updatedNote = { ...selectedNote };

            if(selectedNote.id == null){
                throw new UserInputError('Invalid argument value');
            }
            if(typeof args.note.isArchived === "boolean") {
                updatedNote.isArchived = args.note.isArchived;
                const now = new Date();
                updatedNote.updatedAt = now.toISOString();
            }
            if(typeof args.note.text === "string"){
                updatedNote.text = args.note.text;
                const now = new Date();
                updatedNote.updatedAt = now.toISOString();
            }
            const updatedNotes = savedNotes.map((note) =>{
                if(note.id=== id){
                    return{
                        ...updatedNote
                    };
                }
                return note;
            });
            savedNotes = updatedNotes;

            await saveNotes(savedNotes);

            return updatedNote;
        },
        async deleteNote(_, args){
            savedNotes = await getNotes();

            const { id } = args;

            const selectedNote = savedNotes.find((note) => note.id === id);

            if(selectedNote.id == null){
                throw new UserInputError('Invalid argument value ');
            }
            savedNotes = savedNotes.filter((note)=>(note.id !== id));
            await saveNotes(savedNotes);

            return selectedNote;
        }

    }, 

    Query: {
        async note(_, args){
            const notes2 = await getNotes();
            return notes2.find((note) => note.id === args.id);
        },

        async notes(_, args) {
            const notes2 = await getNotes();
            savedNotes = notes2;
            const { isArchived } = args;
            if(isArchived === true){
                return  savedNotes;
            }else{
                return savedNotes.filter((note) => note.isArchived === false);
            }
            
        }
        
    }
}