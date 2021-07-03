import React, { Component } from "react";
import { View, TouchableHighlight, Text, ScrollView} from 'react-native';
import RecentListening from "./overview/RecentListening";
import TopTracks from "./overview/TopTracks";
import Playlists from "./overview/Playlists";
import RecentlyPlayed
 from "./overview/RecentlyPlayed";
export default class Overview extends Component{
    constructor(props){
        super(props)
        this.getSongId = this.getSongId.bind(this)
        this.state = {
            id:""
        }
    }

    getSongId(id){
        this.setState({
            id:id
        })
    }
    render(){
        return(
            <ScrollView style={{marginBottom:40}}>
                <Text style={{color:"white",fontSize:25, textAlign:"center"}}>Overview</Text>
                <View className="Recent Listening">    
                    <TouchableHighlight onPress={() => {this.props.onRecentPress({screen:"song",previous:"overview",song:{id:this.state.id}})}}>
                        <View style={{padding:10, backgroundColor:"black"}}>
                            <RecentListening refresh={this.props.refresh} getSongId = {this.getSongId}></RecentListening>
                        </View>
                    </TouchableHighlight>
                </View>
                
                <View className="top artists" style={{margin:10}}>
                    <Text style={{color:"white", fontSize:25}}>Top artists past 4 weeks</Text>
                    <TopTracks showScreen={this.props.showScreen}></TopTracks>
                </View>
                    
                <View className="playlists" style={{margin:10}}>
                    <Text style={{color:"white", fontSize:25}}>Playlists</Text>
                    <Playlists showScreen={this.props.showScreen}></Playlists>
                </View>
                
                <View className="recently played" style={{margin:10}}>
                    <Text style={{color:"white", fontSize:25}}>Recently Played</Text>
                    <RecentlyPlayed showScreen={this.props.showScreen}></RecentlyPlayed>
                </View>

           </ScrollView>

            
        )
    }
}