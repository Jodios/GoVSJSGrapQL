import { getPokemon } from "../db/firestore.js";

const pokeResolver = async (parent, args, conextValue, info) => {
    let pokemonPromises = [];
    for(let i = 0; i < args.IDs.length; i++){
        pokemonPromises.push(getPokemon(args.IDs[i]));
    }
    let response = await Promise.all(pokemonPromises);
    return response;
};
export default pokeResolver;