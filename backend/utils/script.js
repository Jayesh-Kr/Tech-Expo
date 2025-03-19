import axios from "axios"

export const verifyIPLocation = async (ip,claimedLocation) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        console.log("Verification started");
        if(response.data.status === 'success') {
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