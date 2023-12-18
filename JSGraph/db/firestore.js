import { Firestore } from "@google-cloud/firestore";

// This must be the absolute path to config json :) 
const CREDENTIAL_KEY = "GOOGLE_APPLICATION_CREDENTIALS"
const POKE_TABLE = "pokemonCache"

let db
let pokemonTable

export const init = () => {
    let credentials = process.env[CREDENTIAL_KEY];
    console.log(credentials)
    if (!credentials) {
        console.log("Could not find configs...");
        process.exit(1);
    }
    db = new Firestore();
    pokemonTable = db.collection(POKE_TABLE);
    console.log("Created Firestore client...")
};

export const getPokemon = async (id) => {
    console.log(`Retrieving pokemon with id: ${id}`);
    try {
        const pokemon = await pokemonTable.doc(`${id}`).get();
        if (!pokemon.exists) {
            throw new Error("Failed to get pokemon")
        }
        return pokemon.data()
    } catch (e) {
        console.log("Failed to get pokemon");
        throw e;
    }
};