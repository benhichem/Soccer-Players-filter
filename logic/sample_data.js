const puppeteer = require('puppeteer');

let data

(async ()=>{

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

    data = {
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
            /*competition: 'foo',*/
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
    }

    module.exports = data

    await browser.close()

})()

