import React from "react";
import { View, ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Track from "../views/components/Track";
export default class RecentlyPlayed extends React.Component{
    constructor(props){
        super(props)
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            dataFetched:false
        }
        this.fetchData();
    }
    async fetchData(){
        let access_token = await AsyncStorage.getItem("access_token");
        
        let data = {
            method:"GET",
            headers:{
                "Authorization":"Bearer "+access_token
            }
          }

          let res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50",data)
          res = await res.json();
          res = res.items

          if (res.error){
            if (res.error.status === 401){
              await this.props.refresh();
              this.fetchData();
            }else if (res.error.message === "Invalid access token"){
              console.log("Invalid access token")
            }
          }else{
            this.setState({
                tracks:res,
                dataFetched:true
            })

          }
    }

    render(){
        if (this.state.dataFetched){
            return(
                <View>
                    {this.state.tracks.map(item => {
                        let artists = [];
                        for (let i = 0; i < item.track.artists.length; i++){
                            artists.push(item.track.artists[i].name)
                        }
                        artists = artists.join(", ")
                        let timeDifference = (((+ new Date()) - (new Date(item.played_at)))/(1000*60*60))
                        let suffix;                        
                        if (timeDifference >=1 && timeDifference < 24){
                            timeDifference = timeDifference.toFixed(0)
                            suffix = "h"
                        }else if (timeDifference>=24){
                            timeDifference = (timeDifference/24).toFixed(0)
                            suffix = "d"
                        }else{
                            timeDifference = (timeDifference*60).toFixed(0)
                            suffix="m"
                        }
                        return(
                            <Track name={item.track.name} id={item.track.id} artists={artists} image={item.track.album.images.slice(-1)[0].url} time={timeDifference+suffix} showScreen={this.props.showScreen}></Track>
                        )
                    })}
                </View>
            )
        }else{
            return(
                <View style={{height:"100%", justifyContent:"center"}}>
                    <ActivityIndicator size="large" color="#1DB954"></ActivityIndicator>
                </View>
            )
        }
        
    }
}