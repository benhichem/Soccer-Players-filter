# Soccer-Players-filter

A simple API to search soccer players via multiple criteria based on the form `https://www.transfermarkt.com/detailsuche/spielerdetail/suche` 

# API

## Request Object
The schema followed has sections and each section has properties which map to the field of the form above. You only have to specify to the the fields you are interested in filling and not the whole sections. The sections are pretty self-explanatory, so I will just list them for reference.

```
 {
        name_options:{
            firstname: string,
            surname : string,
            pseudonym : string,
            fullname: string,
            exact_search : boolean
        },

        personal_data: {
            birth_place: string // 'Country',
            exact_search: boolean,
            citizenship: string // 'Country',
            second_citizenship: string // 'Country',
            birth_country: string // 'Country',
            player_confederation: string // 'Continent',
            birth_day: string-number,
            birth_month: string-number,
            birth_year: string-number,
            age: string number // 'min-max',
            year:  string number // 'min-max',
            height:  string number // 'min-max'

        },
        player_data: {
            position: array-strings,
            main_position: string,
            other_position_1: string,
            other_position_2: string,
            market_value_from: string-number // 'min ,
            market_value_until: string-number // 'max',
            left_foot: boolean,
            right_foot: boolean,
            both_feet: boolean,
            captain_yes: boolean,
            captain_no: boolean,
            player_number: string-number,
            contract_expiry:  array-strings,
            division: array-strings,
            club_from: string // 'Country'

        },
        national_team_data: {
            national_team_players: array-strings, 
            national_team_appearances: string-number // 'min - max'
        },
        contract_active: {
            exclude_new_contract: boolean,
            active_players_only: boolean,
            players_without_club_only: boolean,
            exclude_loaned_players: boolean
        }
    }
```
## How to Use