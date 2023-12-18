import { getPokemon } from "../db/firestore.js";
import { httpRequestTimer } from "../index.js";

const pokeResolver = async (parent, args, conextValue, info) => {
    let end = httpRequestTimer.startTimer();
    try {
        let pokemonPromises = [];
        for (let i = 0; i < args.IDs.length; i++) {
            pokemonPromises.push(getPokemon(args.IDs[i]));
        }
        let response = await Promise.all(pokemonPromises);
        end({
            route: "Pokemon",
            code: 200,
            method: 'POST'
        });
        return response;
    } catch (err) {
        end({
            route: "Pokemon",
            code: 200,
            method: 'POST'
        });
        throw (err);
    }
};
export default pokeResolver;