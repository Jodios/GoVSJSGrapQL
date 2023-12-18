package db

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/jodios/gograph/graph/model"
	"github.com/rs/zerolog/log"
	"google.golang.org/api/option"
)

const (
	POKE_TABLE     string = "pokemonCache"
	CREDENTIAL_KEY string = "FIREBASE_ADMIN"
)

var (
	FirestoreClient *firestore.Client
)

func init() {
	log.Info().Msg("initializing Firestore client...")
	firebaseConfig := os.Getenv(CREDENTIAL_KEY)
	if firebaseConfig == "" {
		log.Fatal().Msgf("%s environment variable must be set.", CREDENTIAL_KEY)
	}

	ctx := context.Background()
	opts := option.WithCredentialsJSON([]byte(firebaseConfig))
	app, err := firebase.NewApp(ctx, nil, opts)
	if err != nil {
		log.Fatal().Msgf("Failed to create Firebase app!\n%v", err.Error())
	}

	FirestoreClient, err = app.Firestore(ctx)
	if err != nil {
		log.Fatal().Msgf("Failed to create Firestore client!\n%v", err.Error())
	}
	log.Info().Msg("Firestore client created successfully!!!")
}

func GetPokemon(id int, ctx context.Context) (pokemon *model.Pokemon, err error) {
	log.Info().Msgf("retrieving pokemon with id: %d", id)
	docRef := FirestoreClient.Doc(fmt.Sprintf("%s/%d", POKE_TABLE, id))
	docSnapshot, err := docRef.Get(ctx)
	if err != nil {
		log.Error().Msg(err.Error())
		return
	}
	rawPokemonData, err := json.Marshal(docSnapshot.Data())
	if err != nil {
		log.Error().Msg(err.Error())
		return
	}
	// os.WriteFile("/Users/jortiz/Documents/Projects/BlogProjects/GoVSJSGraphQL/GoGraph/sample.json", rawPokemonData, 0666)
	pokemon = &model.Pokemon{}
	err = json.Unmarshal(rawPokemonData, pokemon)
	if err != nil {
		log.Error().Msg(err.Error())
		return nil, err
	}
	return
}
