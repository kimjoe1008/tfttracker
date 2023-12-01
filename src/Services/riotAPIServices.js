const API_KEY = 'RGAPI-a39a620f-7228-4a45-9103-08dc9dacac18';
const baseurl = 'https://na1.api.riotgames.com/tft/';

export async function getChallengerLeaderboard(){
  // Function to get TFT challenger leaderboard
  //try will run until it reaches an error in which case it will exit and run the catch
  try {
    const response = await fetch(`${baseurl}league/v1/challenger?queue=RANKED_TFT`, {
        headers: {
            'X-Riot-Token': API_KEY
        }
    });
    

    //if response fails throw the error message and gets sent to catch
    if(!response.ok){
        //standard error message
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }    
    const responseData = await response.json();
    return responseData;
    } catch(error){
        console.error('Error fetching Challenger TFT leaderboard:', error.message);
  }
}



export async function getGrandMasterLeaderboard(){
    // Function to get TFT grandmaster leaderboard
    //try will run until it reaches an error in which case it will exit and run the catch
    try {
        const response = await fetch(`${baseurl}league/v1/grandmaster?queue=RANKED_TFT`, {
            headers: {
                'X-Riot-Token': API_KEY
            }
        });
      
  
      //if response fails throw the error message and gets sent to catch
        if(!response.ok){
            //standard error message
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const responseData = await response.json();
        return responseData;
    } catch(error){
        console.error('Error fetching GrandMaster TFT leaderboard:', error.message);
    }
}

export async function getTopTeamComps(){
    try {
        //holds the 2 fetch calls
        const challengerData = await getChallengerLeaderboard();
        const grandmasterData = await getGrandMasterLeaderboard();


    } catch (error) {
        console.error('Error getting top team compositions', error.message);
    }
}