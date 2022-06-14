const puppeteer = require('puppeteer');

const schema_player_search = require('./logic/in_schema');
const test_data = require('./logic/sample_data');

const form_handler = (async (data)=>{

    const browser = await puppeteer.launch({
        'headless': true,
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

    // scrape the countries | #Detailsuche_land_id
    const countries = await page.$$eval('#Detailsuche_land_id > option:nth-child(n+2)', (countries)=>{
        return Array.from(countries, country=>{
            return /*country.getAttribute('value'),*/ country.textContent
        })
    })
    //console.log(countries)
    // scrape the confederations | #Detailsuche_kontinent_id
    const confederations = await page.$$eval('#Detailsuche_kontinent_id > option:nth-child(n+2)', (confederations)=>{
        return Array.from(confederations, confederation=>{
            return /*confederation.getAttribute('value'),*/ confederation.textContent
        })
    })
    //console.log(confederations)
    // position | #Detailsuche_hauptposition_id
    const positions = await page.$$eval('#Detailsuche_hauptposition_id > option:nth-child(n+2)', (positions)=>{
        return Array.from(positions, position =>{
            return /*position.getAttribute('value'),*/ position.textContent
        })
    })
    //console.log(positions)
    const basic_positions = await page.$$eval('#Detailsuche_position > option:nth-child(n+2)', (positions)=>{
        return Array.from(positions, position =>{
            return /*position.getAttribute('value'),*/ position.textContent
        })
    })
    //console.log(basic_positions)
    // division | #Detailsuche_art_neu
    const divisions = await page.$$eval('#Detailsuche_art_neu > option', (divisions)=>{
        return Array.from(divisions, division =>{
            return /*division.getAttribute('value'),*/ division.textContent
        })
    })
    //console.log(divisions)
    // national team player | #Detailsuche_nm_status
    const stati = await page.$$eval('#Detailsuche_nm_status > option', (stati)=>{
        return Array.from(stati, status =>{
            return /*status.getAttribute('value'),*/ status.textContent
        })
    })
    //console.log(stati)
    // expiration years | #Detailsuche_vertrag
    const years = await page.$$eval('#Detailsuche_vertrag > option:nth-child(n+2)', (years)=>{
        return Array.from(years, year=>{
            return /*year.getAttribute('value'),*/ year.textContent
        })
    })
    // console.log(years)

    // Test data

    /*const data = {
        name_options : {
            firstname: 'Ronaldo'
        }
    }*/

    /*/data = {
        name_options:{
            firstname: 'boo',
            surname :'boo',
            pseudonym : 'moo',
            fullname: 'foo foo',
            exact_search : true
        },
        personal_data: {
            birth_place:'foo',
            exact_search: true,
            citizenship: countries[Math.floor(Math.random()*countries.length)],
            second_citizenship: countries[Math.floor(Math.random()*countries.length)],
            birth_country: countries[Math.floor(Math.random()*countries.length)],
            player_confederation: confederations[Math.floor(Math.random()*confederations.length)],
            birth_day: '2',
            birth_month: '11',
            birth_year: '1995',
            age: '15 - 60',
            year:  '1997 - 2000',
            height:  '20 - 100'

        },
        player_data: {
            position: [
                basic_positions[Math.floor(Math.random()*basic_positions.length)],
                basic_positions[Math.floor(Math.random()*basic_positions.length)]
        ],
            main_position: positions[Math.floor(Math.random()*positions.length)],
            other_position_1: positions[Math.floor(Math.random()*positions.length)],
            other_position_2: positions[Math.floor(Math.random()*positions.length)],
            market_value_from: '200' ,
            market_value_until: '50000',
            left_foot: true,
            right_foot: true,
            both_feet: true,
            captain_yes: true,
            captain_no: true,
            player_number: '7',
            contract_expiry: [
                years[Math.floor(Math.random()*years.length)]
            ]   
        ,
            competition: 'foo',
            division: [
                divisions[Math.floor(Math.random()*divisions.length)],
            ],
            club_from: countries[Math.floor(Math.random()*countries.length)]

        },
        national_team_data: {
            national_team_players: [
                stati[Math.floor(Math.random()*stati.length)]
            ], 
            national_team_appearances: '15 - 100'
        },
        contract_active: {
            exclude_new_contract: true,
            active_players_only: true,
            players_without_club_only: true,
            exclude_loaned_players: true
        }
    }*/

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
                type: 'select_1',
                selector: '#Detailsuche_land_id_chzn'
            },
            second_citizenship: {
                type: 'select_1',
                selector: '#Detailsuche_zweites_land_id_chzn'
            },
            birth_country: {
                type: 'select_1',
                selector: '#Detailsuche_geb_land_id_chzn'
            },
            player_confederation: {
                type: 'select_1',
                selector: '#Detailsuche_kontinent_id_chzn'
            },
            birth_day: {
                type: 'select_1',
                selector: '#Detailsuche_geburtstag_chzn'
            },
            birth_month: {
                type: 'select_1',
                selector: '#Detailsuche_geburtsmonat_chzn'
            },
            birth_year: {
                type: 'select_1',
                selector: '#Detailsuche_geburtsjahr_chzn'
            },
            age: {
                type: 'fill_default',
                selector: '#amountAlter'
            },
            year:  {
                type: 'fill_default',
                selector: '#amountJahrgang'
            },
            height:  {
                type: 'fill_default',
                selector: '#amountGroesse'
            }

        },
        player_data: {
            position: {
                type: 'select_2',
                selector: '#Detailsuche_position_chzn'
            },
            main_position: {
                type: 'select_1',
                selector: '#Detailsuche_hauptposition_id_chzn'
            },
            other_position_1: {
                type: 'select_1',
                selector: '#Detailsuche_nebenposition_id_1_chzn'
            },
            other_position_2:    {
                type: 'select_1',
                selector: '#Detailsuche_nebenposition_id_2_chzn'
            },
            market_value_from: {
                type: 'fill_default',
                selector: '#Detailsuche_minMarktwert'
            } ,
            market_value_until: {
                type: 'fill_default',
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
                type: 'select_2',
                selector: '#Detailsuche_vertrag_chzn'
            },
            /*competition: {
                type: 'fill',
                selector: '#token-input-Detailsuche_wettbewerb_id'
            },*/ // Hard to have a handl on. Linked to some background JS.
            division: {
                type: 'select_2',
                selector: '#Detailsuche_art_neu_chzn'
            },
            club_from: {
                type: 'select_1',
                selector: '#Detailsuche_w_land_id_chzn'
            }

        },
        national_team_data: {
            national_team_players:{
                type: 'select_2',
                selector: '#Detailsuche_nm_status_chzn'
            }, 
            national_team_appearances: {
                type: 'fill_default',
                selector: '#amountNmSpiele'
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

    // Data conformity checker
    async function check(data){

        // Validation of the object form
        if((schema_player_search.validate(data)).hasOwnProperty('error')){
            console.log(`[-] Request object is not conform to the schema.`)
            return false
       }

        // Valiation of the object content

        if(
            data.hasOwnProperty('personal_data')
        ){
            if((
                (data.personal_data.hasOwnProperty('citizenship'))?!countries.includes(data.personal_data.citizenship): false ||
                (data.personal_data.hasOwnProperty('second_citizenship'))?!countries.includes(data.personal_data.second_citizenship): false ||
                (data.personal_data.hasOwnProperty('birth_country'))?!countries.includes(data.personal_data.birth_country): false ||
                (data.personal_data.hasOwnProperty('club_from'))?!countries.includes(data.player_data.club_from): false ||
                (data.personal_data.hasOwnProperty('player_confederation'))?!confederations.includes(data.personal_data.player_confederation): false ||
                (data.personal_data.hasOwnProperty('position'))?!(()=>{
                    for(const element of data.player_data.position){
                        if(!positions.includes(element)){
                            return false
                        }
                        return true
                    }
                })(): false ||
                (data.player_data.hasOwnProperty('contract_expiry'))?!(()=>{
                    for(const element of data.player_data.contract_expiry){
                        if(!years.includes(element)){
                            return false
                        }
                        return true
                    }
                })(): false ||
                (data.player_data.hasOwnProperty('division'))?!(()=>{
                    for(const element of data.player_data.division){
                        if(!divisions.includes(element)){
                            return false
                        }
                        return true
                    }
                })(): false ||
                (data.national_team_data.hasOwnProperty('national_team_players'))?!(()=>{
                    for(const element of data.national_team_data.national_team_players){
                        if(!stati.includes(element)){
                            return false
                        }
                        return true
                    }
                })() : false 
            )) {
                         
                console.log(`[-] Request object has invalid content.`)
                return false
            } else {
                return true
            }
        } else {
            return true
        }
        

    }

    // Generic functions to fill the form.
    async function fill(type, selector, text){
        await page.waitForSelector(selector)
        if(type.includes('default')){
            await page.click(selector, {clickCount:3})
        }
        for await (const char of text.toString().split('')){
            await page.type(selector, char)
        }

    }

    async function tick(selector){

        await page.waitForSelector(selector)
        await page.click(selector)

    }

    async function select(type, selector, option){
        if(type.includes('1')){
            await page.waitForSelector(selector)
            await page.click(selector + '> a')
            await fill('fill', selector + '> div > div > input[type=search]', option)
            await page.click(selector + '> div > ul > li.active-result.highlighted')
        }else {
            await page.waitForSelector(selector)
            await page.click(selector + '> ul')
            for await (const element of option){
                await fill('fill', selector + '> ul > li > input', element)
                await page.click(selector + '> div > ul > li.active-result.highlighted')
            }
            
        }

    }

    
    // Main handler

    async function fill_form(data){
        if(await check(data)){
                for await (const section of Object.entries(data)){
                console.log(section)
                for await (const field of Object.entries(section[1])){
                    console.log(field)
                    const input = form_schema[section[0]][field[0]]
                    console.log(input)
                    const value = field[1]

                    if(input.type.includes('fill')){
                        await fill(input.type, input.selector, value)
                    }

                    if(input.type==='tick' && value===true){
                    await tick(input.selector) 
                    }

                    if(input.type.includes('select')){
                        await select(input.type, input.selector, value)
                    }
                }
            }
            // Click on submit.
            await tick('#detsu-sonstige > div.footer > input')

            // Grab the URL
            try{
                await page.waitForSelector('#spieler-detail-suche > div:nth-child(1) > div > div > div.table-header')
                const url = await page.url()
                return url
            } catch(error){
                console.log(`[-] Error: ${error}. Request failed.`)
            }

        } else {
            console.log('[-] Request again.')
        }
        
    }

    // Check and  fill the form
    const url = await fill_form(data)
    
    if (url) {
        
        console.log(url)
        await browser.close()
        return url

    } else{

        await browser.close()

    }


})

form_handler(test_data); // the argument is meaningless as I redefine data inside the function


module.exports = form_handler