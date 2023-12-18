export const typeDefs = `#graphql
type Query {
  Pokemon(IDs: [Int!]!): [Pokemon!]
}

type Type {
  Name: String
  URL: String
}

type Types {
  Slot: Int
  Type: Type
}

type Stat {
  Name: String
  URL: String
}

type Stats {
  BaseStat: Int
  Effort: Int
  Stat: Stat
}

type Sprites {
  BackDefault: String
  BackFemale: String
  BackShiny: String
  BackShinyFemale: String
  FrontDefault: String
  FrontFemale: String
  FrontShiny: String
  FrontShinyFemale: String
}

type Species {
  Name: String
  URL: String
}

type VersionGroup {
  Name: String
  URL: String
}

type MoveLearnMethod {
  Name: String
  URL: String
}

type VersionGroupDetails {
  LevelLearnedAt: Int
  VersionGroup: VersionGroup
  MoveLearnMethod: MoveLearnMethod
}

type Move {
  Name: String
  URL: String
}

type Moves {
  VersionGroupDetails: [VersionGroupDetails]
  Move: Move
}

type Version {
  Name: String
  URL: String
}

type GameIndices {
  GameIndex: Int
  Version: Version
}

type Forms {
  Name: String
  URL: String
}

type Ability {
  Name: String
  URL: String
}

type Abilities {
  IsHidden: Boolean
  Slot: Int
  Ability: Ability
}

type VersionDetails {
  rarity: Int
  version: Version
}

type Item {
  name: String
  url: String
}

type HeldItems {
  version_details: [VersionDetails]
  item: Item
}

type Pokemon {
  BaseExperience: Int
  Height: Int
  ID: Int
  IsDefault: Boolean
  LocationAreaEncounters: String
  Name: String
  Order: Int
  Weight: Int
  Types: [Types]
  Stats: [Stats]
  Sprites: Sprites
  Species: Species
  Moves: [Moves]
  HeldItems: [HeldItems]
  GameIndices: [GameIndices]
  Forms: [Forms]
  Abilities: [Abilities]
}

# Types with identical fields:
# Type Stat Species VersionGroup MoveLearnMethod Move Version Forms Ability
`