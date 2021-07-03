import React, { Component } from "react";
import { View, ScrollView, Text, ActivityIndicator, TouchableHighlight, Dimensions, RefreshControlBase} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fetch from "./Fetch";

export default class Stats extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataFetched:false
        }
        this.updateRecent = this.updateRecent.bind(this);
        this.updateRecent();
        this.getData();
    }

    async updateRecent(){
        let recent = await new Fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50").getData();
        let recentStored = await AsyncStorage.getItem("recent");
        recentStored = JSON.parse(recentStored)
        let newTracks = [];
        if (recentStored){
            recent[0].items.forEach(item => {
                if (new Date(item.played_at) > new Date(recentStored[0].played_at)){
                    newTracks.push(item)
                }
            })
            recentStored = [...newTracks, ...recentStored]
            await AsyncStorage.setItem("recent", JSON.stringify(recentStored))
        }else{
            await AsyncStorage.setItem("recent",JSON.stringify(recent[0].items))
        }

        let totalListened = 0
        recentStored.forEach((item) => {
            totalListened += (item.track.duration_ms/(1000*60))
        })
        totalListened = totalListened.toFixed(0);

        let oldest = recentStored.slice(-1)[0]
        let since = new Date(oldest.played_at);
        let months = ["January","February", "March", "April","May","June","July","August","September","October","November","December"];
        since = (since.getDate() + "th of "+months[since.getMonth()] + ", "+since.getFullYear())

        return {total:totalListened, since:since}
    }

    async getData(){
        let tracks = await new Fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term").getData()

        let genres = {};
        let trackFeatures = {};
        let max = {genre:"", number:0};

        tracks.forEach(async item => {
            let items = item.items;
            let artistIds = [];
            items.forEach(track => {
                artistIds.push(track.artists[0].id)                
            })
            artistIds = artistIds.join(",");
            let artists = await new Fetch("https://api.spotify.com/v1/artists?ids="+artistIds).getData();

            artists[0].artists.forEach(artist => {
                artist.genres.forEach(genre => {
                    if (!Object.keys(genres).includes(genre)){
                        genres[genre] = [artist]
                    }else{
                        genres[genre].push(artist)
                    }
                })
            })

            let trackIds = [];
            items.forEach(track => {
                trackIds.push(track.id)
            })
            trackIds = trackIds.join(",");
            let features = await new Fetch("https://api.spotify.com/v1/audio-features?ids="+trackIds).getData();
            features[0].audio_features.forEach(item => {
                Object.keys(item).forEach(feature => {
                    if (["acousticness","danceability","energy","instrumentalness","liveness","speechiness", "valence"].includes(feature)){
                        if (item[feature] > 0.6){
                            if (trackFeatures[feature]){
                                trackFeatures[feature] += 1
                            }else{
                                trackFeatures[feature] = 1
                            }
                        }
                    }
                })
            })
            Object.keys(genres).forEach(genre => {
                if (genres[genre].length > max.number){
                    max = {genre:genre, number:genres[genre].length}
                }
            })
        })

        

        let listened = await this.updateRecent();
        this.setState({
            genres:genres,
            trackFeatures:trackFeatures,
            total:listened.total,
            since:listened.since,
            dataFetched:true,
            max:max
        }, () => {
            console.log(this.state)
        })
    }
    render(){
        if (this.state.dataFetched){
            return(
                <View style={{marginBottom:40}}>
                    <Text style={{color:"white",fontSize:25, textAlign:"center"}}>Stats</Text>
                    <View style={{margin:10}}>
                        <Text style={{color:"white", fontSize:25}}>Genres</Text>
                        <Text>
                            <Text style={{color:"white", fontSize:20}}>Your top genre is </Text>
                            <Text style={{color:"#1DB954", fontSize:20}}>{this.state.max.genre}</Text>
                            <Text style={{color:"white", fontSize:20}}> which appears in </Text>
                            <Text style={{color:"#1DB954", fontSize:20}}>{this.state.max.number/0.5}% </Text>
                            <Text style={{color:"white", fontSize:20}}>of your top tracks.</Text>
                        </Text>
                    </View>
                    <View style={{margin:10, backgroundColor:"rgb(20,20,20)", borderRadius:10, padding:10}}>
                        <Text style={{color:"#1DB954", fontSize:25}}>{this.state.total}</Text>
                        <Text style={{color:"white", fontSize:20}}>minutes listened since {this.state.since}</Text>
                    </View>
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