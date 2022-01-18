import Fetch from "./Fetch";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from "base-64"

export default class Post extends Fetch{
    async getData(body){
        let access_token = await AsyncStorage.getItem("access_token");
        let data = {
            method:"POST",
            headers:{
                "Authorization":"Bearer "+access_token
            },
            body:JSON.stringify(body)
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
}