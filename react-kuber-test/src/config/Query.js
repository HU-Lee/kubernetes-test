import gql from "graphql-tag"

export const GET_KOR_TODAY_DATA = (bool) => gql`
    query {
        koreaTodayData(loadDB: ${bool}) {
            newDef
            newDeath
            newClear
            newCheck
            totDef
            totDeath
            totClear
            totCheck
            update
            isToday
        }
    }`;

export const GET_KOR_PART_DATA = (bool) => gql`
    query {
        koreaTodayData(loadDB: ${bool}) {
            partData {
                name
                newDef
            }
            inside {
                name
                newDef
            }
            outside {
                name
                newDef
            }
            newDef
            update
            isToday
        }
    }`;

export const GET_KOR_WEEK_DATA = (bool) => gql`
    query {
        koreaWeekData(loadDB: ${bool}) {
            weekData {
              date
              inside
              outside
            }
            update
            isToday
        } 
    }`;

export const GET_INTER_DATA = (bool) => gql`
    query {
        interData(loadDB: ${bool}){
            rankings {
              name
              newDef
              totDef
              newDeath
              totDeath
            }
            update
            isToday
        }
    }`;