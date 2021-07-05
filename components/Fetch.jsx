import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from "base-64"

export default class Fetch{
    constructor(url){
        this.url = url;
        this.result = [];
        this.getData = this.getData.bind(this);
        this.error = this.error.bind(this);
        this.refresh = this.refresh.bind(this)
    }   

    async getData(){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
        }
        try{
            let res = await fetch(this.url, data);
            res = await res.json();
            if (res.error){
                await this.error(res)
            }else{
                this.result.push(res);
                if (res.next){
                    this.url = res.next;
                    await this.getData();
                    return this.result
                }else{
                    return [res]
                }
            }
        }catch(error){
            console.log(error)
        }
    }

    async error(res){
        console.log(res)
        if (res.error.status === 401){
            await this.refresh();
            this.getData();
        }else if (this.tracks.error.message === "invalid access token"){
            console.error("invalid access token for Spotify request.")
        }
    }

    async refresh(){
        let refresh_token = await AsyncStorage.getItem("refresh_token")
        let data = {
          method:"POST",
          headers:{
            'Authorization': "Basic "+encode("034aecf762cf4795a294c19c1e08c9e7:fe27ece9c68f4bffa478ba00efb7a9ae"),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: "grant_type=refresh_token&refresh_token="+refresh_token
        }
        let result = await fetch("https://accounts.spotify.com/api/token", data)
        result = await result.json()
        await AsyncStorage.setItem("access_token", result.access_token)
    }
} 
