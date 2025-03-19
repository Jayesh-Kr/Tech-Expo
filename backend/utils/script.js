import axios from "axios"

export const verifyIPLocation = async (ip,claimedLocation) => {
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        console.log("Verification started");
        if(response) {
            const claimedLocationLower = claimedLocation.toLowerCase();
            const actualCity = response.data.city.toLowerCase();
            const actualCountry = response.data.country.toLowerCase();
            console.log(`Actual city : ${actualCity}`);
            console.log(`Actual country : ${actualCountry}`);
            return claimedLocationLower.includes(actualCity) || claimedLocationLower.includes(actualCountry) || actualCity.includes(claimedLocationLower) || actualCountry.includes(claimedLocationLower);
        }
        return false;
    } catch(err) {
        console.error("IP verification error : " , err);
        return false;
    }
}