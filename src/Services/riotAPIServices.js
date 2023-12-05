const API_KEY = 'RGAPI-cc47e8fd-e325-48f7-8d00-ae197dcac5d5';
const baseurl = 'https://na1.api.riotgames.com/tft/';

//having the functions just have to call one method to retrieve data and having to input the endpoint only is more efficient
async function fetchTFTLeaderboard(endpoint) {
    try {
      const response = await fetch(`${baseurl}${endpoint}?queue=RANKED_TFT`, {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData;
      //this is what is returned if response.ok is false
    } catch (error) {
      console.error(`Error fetching TFT leaderboard for ${endpoint}:`, error.message);
    }
  }
  
export async function getChallengerLeaderboard(){
    return fetchTFTLeaderboard('league/v1/challenger');
}
  
export async function getGrandMasterLeaderboard(){
    return fetchTFTLeaderboard('league/v1/grandmaster');
}

export async function getPuuid(summonerid){
    try {
        const response = await fetch(`${baseurl}league/v1/entries/by-summoner/${summonerid}`, {
            headers: {
                'X-Riot-Token': API_KEY,
            },
        });

        if(!response.ok){
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const summonerInfo = await response.json();
        if(summonerInfo.length > 0){
            const summonerPuuid = summonerInfo[0].puuid;
            return summonerPuuid;
        }else{
            console.log('Summoner info not found');
        }


    } catch (error) {
        console.error('error getting puuid', error.message);
    }
}

export async function getMatchHistory(summonerPuuid){
    try {
        const response = await fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${summonerPuuid}/ids?start=0&count=200`, {
            headers: {
                'X-Riot-Token': API_KEY,
            }
        });

        if(!response.ok){
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const matchHistory = response.json();
        return matchHistory;
    } catch (error) {
        console.error('error getting match history', error.message);
    }
}

export async function getMatchDetails(matchId){
    try {
        const response = await fetch(`https://americas.api.riotgames.com/tft/match/v1/matches/${matchId}`, {
            headers: {
                'X-Riot-Token': API_KEY,
            },
        });

        if (!response.ok){
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const matchDetails = await response.json();
        return matchDetails;
    } catch (error){
        console.error(`Error getting match details for ${matchId}:`, error.message);
    }
}

//input 1 match and the associated puuid
export async function processMatchHistory(matchId, puuid){
    const placementHashMap = new Map();
    try {
        const matchDetails = await getMatchDetails(matchId);
        const gameVersion = matchDetails.info.game_version;

        const participant = matchDetails.info.participants.find(participant => participant.puuid === puuid);
        if(participant){
            let highestIndex = 0;
            let highestCount = 0;
            for(let i = 0; i < participants[0].traits.length; i++){
                if(participants[0].traits[i].num_units > highestCount){
                    highestIndex = i;
                    highestCount = participants[0].traits[i].num_units;
                }
            }
            if(placementHashMap.get(participants[0].traits[i].name) === 0){
                placementHashMap.set(participants[0].traits[i].name, participants.placement)
            } else{
                placementHashMap.set(participants[0].traits[i].name, (participants.placement + placementHashMap.get(participants[0].traits[i].name)/2));
            }
        }
    } catch (error) {
        console.error(`Error processing match ${matchId}:`, error.message);
    }
    let currentIndex = 1;
    while (currentIndex < matchHistory.length) {
        const matchId = matchHistory[currentIndex];

        try {
            const matchDetails = await getMatchDetails(matchId);
    
            const participant = matchDetails.info.participants.find(participant => participant.puuid === puuid);
            if(participant){
                let highestIndex = 0;
                let highestCount = 0;
                for(let i = 0; i < participants[currentIndex].traits.length; i++){
                    if(participants[currentIndex].traits[i].num_units > highestCount){
                        highestIndex = i;
                        highestCount = participants[currentIndex].traits[i].num_units;
                    }
                }
                if(placementHashMap.get(participants[currentIndex].traits[i].name) === 0){
                    placementHashMap.set(participants[currentIndex].traits[i].name, participants.placement)
                } else{
                    placementHashMap.set(participants[currentIndex].traits[i].name, (participants.placement + placementHashMap.get(participants[0].traits[i].name)/2));
                }
                break
            }
            currentIndex++;
        } catch (error) {
            // Handle errors or log them as needed
            console.error(`Error processing match ${matchId}:`, error.message);
            // Move to the next match in case of an error
            currentIndex++;
        }
    }

    return placementHashMap;
}