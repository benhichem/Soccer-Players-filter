const puppeteer = require('puppeteer');

( async ()=>{

    const browser = await puppeteer.launch({
        'headless': false,
        //slowMo: 50
    })

    const page = await browser.newPage()

    await page.goto('https://www.transfermarkt.com/detailsuche/spielerdetail/suche',
        { waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"] }
    )

    // Removes the cookies popup
    
        const popup_frame = await page.waitForSelector('#sp_message_iframe_575843')
        const frame = await popup_frame.contentFrame()
        const buttons = await frame.$x('/html/body/div/div[2]/div[3]/div[2]/button')
        await buttons[0].click() 

    // Test data

    const data = {
        name_options:{
            firstname: 'Ronaldo',
            /*surname :'sui',
            pseudonym : 'goat',*/
            /*fullname: 'Christiano Ronaldo',*/
            /*exact_search : true*/
        },
        personal_data: {
            birth_place:'Chkoupistan',
            exact_search: true,
            citizenship: '4',
            /*second_citizenship: {
                type: 'select',
                selector: '#Detailsuche_zweites_land_id'
            },
            birth_country: {
                type: 'select',
                selector: '#Detailsuche_geb_land_id'
            },
            player_confederation: {
                type: 'select',
                selector: '#Detailsuche_kontinent_id'
            },
            birth_day: {
                type: 'select',
                selector: '#Detailsuche_geburtstag'
            },
            birth_month: {
                type: 'select',
                selector: '#Detailsuche_geburtsmonat'
            },
            birth_year: {
                type: 'select',
                selector: '#Detailsuche_geburtsjahr'
            },
            age: {
                type: 'fill',
                selector: '#amountAlter'
            },
            year:  {
                type: 'fill',
                selector: '#amountJahrgang'
            },
            height:  {
                type: 'fill',
                selector: '#amountGroesse'
            }*/

        },/*
        player_data: {
            position: {
                type: 'select',
                selector: '#Detailsuche_position'
            },
            main_position: {
                type: 'select',
                selector: '#Detailsuche_hauptposition_id'
            },
            other_position_1: {
                type: 'select',
                selector: '#Detailsuche_nebenposition_id_1'
            },
            other_position_2:    {
                type: 'select',
                selector: '#Detailsuche_nebenposition_id_2'
            },
            market_value_from: {
                type: 'fill',
                selector: '#Detailsuche_minMarktwert'
            } ,
            market_value_until: {
                type: 'fill',
                selector: '#Detailsuche_maxMarktwert'
            } ,
            left_foot: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_0'
            },
            right_foot: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_1'
            },
            both_feet: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_2'
            },
            captain_yes: {
                type: 'tick',
                selector: '#Detailsuche_captain_0'
            },
            captain_no: {
                type: 'tick',
                selector: '#Detailsuche_captain_1'
            },
            player_number: {
                type: 'fill',
                selector: '#Detailsuche_rn'
            },
            contract_expiry: {
                type: 'select',
                selector: '#Detailsuche_vertrag'
            },
            competition: {
                type: 'fill',
                selector: '#token-input-Detailsuche_wettbewerb_id'
            },
            division: {
                type: 'select',
                selector: '#Detailsuche_art_neu'
            },
            club_from: {
                type: 'select',
                selector: '#Detailsuche_w_land_id'
            }

        },
        national_team_data: {
            national_team_players:{
                type: 'fill',
                selector: '#Detailsuche_nm_status'
            }, 
            national_team_appearances: {
                type: 'fill',
                selector: '#Detailsuche_passname'
            }
        },
        contract_active: {
            exclude_new_contract: {
                type: 'tick',
                selector: '#Detailsuche_trans_id'
            },
            active_players_only: {
                type: 'tick',
                selector: '#Detailsuche_aktiv'
            },
            players_without_club_only: {
                type: 'tick',
                selector: '#Detailsuche_vereinslos'
            },
            exclude_loaned_players: {
                type: 'tick',
                selector: '#Detailsuche_leihen'
            }
        }*/
    }

    // An object with the same schema of the request but filled with the associated selectors.
    const form_schema = {
        name_options: {
            firstname: {
                type: 'fill',
                selector: '#Detailsuche_vorname'
            },
            surname: {
                type: 'fill',
                selector: '#Detailsuche_name'
            },
            pseudonym:  {
                type: 'fill',
                selector: '#Detailsuche_name_anzeige'
            },
            fullname:  {
                type: 'fill',
                selector: '#Detailsuche_passname'
            },
            exact_search:  {
                type: 'tick',
                selector: '#Detailsuche_genaue_suche'
            }
        },
        personal_data: {
            birth_place: {
                type: 'fill',
                selector: '#Detailsuche_geb_ort'
            },
            exact_search:  {
                type: 'tick',
                selector: '#Detailsuche_genaue_suche_geburtsort'
            },
            citizenship: {
                type: 'select',
                selector: '#Detailsuche_land_id'
            },
            second_citizenship: {
                type: 'select',
                selector: '#Detailsuche_zweites_land_id'
            },
            birth_country: {
                type: 'select',
                selector: '#Detailsuche_geb_land_id'
            },
            player_confederation: {
                type: 'select',
                selector: '#Detailsuche_kontinent_id'
            },
            birth_day: {
                type: 'select',
                selector: '#Detailsuche_geburtstag'
            },
            birth_month: {
                type: 'select',
                selector: '#Detailsuche_geburtsmonat'
            },
            birth_year: {
                type: 'select',
                selector: '#Detailsuche_geburtsjahr'
            },
            age: {
                type: 'fill',
                selector: '#amountAlter'
            },
            year:  {
                type: 'fill',
                selector: '#amountJahrgang'
            },
            height:  {
                type: 'fill',
                selector: '#amountGroesse'
            }

        },
        player_data: {
            position: {
                type: 'select',
                selector: '#Detailsuche_position'
            },
            main_position: {
                type: 'select',
                selector: '#Detailsuche_hauptposition_id'
            },
            other_position_1: {
                type: 'select',
                selector: '#Detailsuche_nebenposition_id_1'
            },
            other_position_2:    {
                type: 'select',
                selector: '#Detailsuche_nebenposition_id_2'
            },
            market_value_from: {
                type: 'fill',
                selector: '#Detailsuche_minMarktwert'
            } ,
            market_value_until: {
                type: 'fill',
                selector: '#Detailsuche_maxMarktwert'
            } ,
            left_foot: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_0'
            },
            right_foot: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_1'
            },
            both_feet: {
                type: 'tick',
                selector: '#Detailsuche_fuss_id_2'
            },
            captain_yes: {
                type: 'tick',
                selector: '#Detailsuche_captain_0'
            },
            captain_no: {
                type: 'tick',
                selector: '#Detailsuche_captain_1'
            },
            player_number: {
                type: 'fill',
                selector: '#Detailsuche_rn'
            },
            contract_expiry: {
                type: 'select',
                selector: '#Detailsuche_vertrag'
            },
            competition: {
                type: 'fill',
                selector: '#token-input-Detailsuche_wettbewerb_id'
            },
            division: {
                type: 'select',
                selector: '#Detailsuche_art_neu'
            },
            club_from: {
                type: 'select',
                selector: '#Detailsuche_w_land_id'
            }

        },
        national_team_data: {
            national_team_players:{
                type: 'fill',
                selector: '#Detailsuche_nm_status'
            }, 
            national_team_appearances: {
                type: 'fill',
                selector: '#Detailsuche_passname'
            }
        },
        contract_active: {
            exclude_new_contract: {
                type: 'tick',
                selector: '#Detailsuche_trans_id'
            },
            active_players_only: {
                type: 'tick',
                selector: '#Detailsuche_aktiv'
            },
            players_without_club_only: {
                type: 'tick',
                selector: '#Detailsuche_vereinslos'
            },
            exclude_loaned_players: {
                type: 'tick',
                selector: '#Detailsuche_leihen'
            }
        }
    }

    // Generic functions to fill the form.

    async function fill(selector, text){

        await page.waitForSelector(selector)
        for await (const char of text.toString().split('')){
            await page.type(selector, char)
        }

    }

    async function tick(selector){

        await page.waitForSelector(selector)
        await page.click(selector)

    }

    async function select(selector, option){

        await page.waitForSelector(selector)
        await page.select(selector, option)

    }

    // scrape the countries | #Detailsuche_land_id
    const countries = await page.$$eval('#Detailsuche_land_id > option:nth-child(n+2)', (countries)=>{
        return Array.from(countries, country=>{
            return [country.getAttribute('value'), country.textContent]
        })
    })
    console.log(countries)
    // scrape the confederations | #Detailsuche_kontinent_id

    // position | #Detailsuche_hauptposition_id
    // division | #Detailsuche_art_neu
    // national team player | #Detailsuche_nm_status


    // Main handler

    async function fill_form(data){
        for await (const section of Object.entries(data)){
            for await (const field of Object.entries(section[1])){

                const input = form_schema[section[0]][field[0]]
                const value = field[1]

                if(input.type==='fill'){
                    await fill(input.selector, value)
                }

                if(input.type==='tick' && value===true){
                   await tick(input.selector) 
                }

                if(input.type==='select'){
                    await select(input.selector, value)
                }
            }
        }
    }

    // Fill the form

    await fill_form(data)

    // Click on submit.
    //await tick('#detsu-sonstige > div.footer > input')

    // Grab the URL
    const url = await page.url()

    console.log(url)

    //await browser.close()

})();