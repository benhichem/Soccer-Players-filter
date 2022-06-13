const Joi = require('joi');

const schema_player_search = Joi.object({
    name_options: Joi.object({
        firstname: Joi.string(),
        surname: Joi.string(),
        pseudonym: Joi.string(),
        fullname: Joi.string(),
        exact_search: Joi.bool()
    }),
    personal_data: Joi.object({
        birth_place: Joi.string(),
        citizenship: Joi.string(),
        second_citizenship: Joi.string(),
        birth_country: Joi.string(),
        player_confederation: Joi.string(),
        birth_day: Joi.number()
            .min(1)
            .max(31),
        birth_month: Joi.number()
            .min(1)
            .max(12),
        birth_year: Joi.number()
            .min(1831)
            .max(2020),
        age: Joi.string(),
        year: Joi.string(),
        height: Joi.string()

    }),
    player_data: Joi.object({
        position: Joi.string(),
        main_position: Joi.string(),
        other_position_1: Joi.string(),
        other_position_2: Joi.string(),
        market_value_from: Joi.string(),
        market_value_until: Joi.string(),
        foot: Joi.string(),
        captain: Joi.bool(),
        player_number: Joi.number(),
        contract_expiry: Joi.number(),
        competition: Joi.string(),
        division: Joi.string(),
        club_from: Joi.string()

    }),
    national_team_data: Joi.object({
        national_team_players: Joi.string(),
        national_team_appearances: Joi.string()
    }),
    contract_active: Joi.object({
        exclude_new_contract: Joi.bool(),
        active_players_only: Joi.bool(),
        players_without_club_only: Joi.bool(),
        exclude_loaned_players: Joi.bool()
    })
})

module.exports = schema_player_search