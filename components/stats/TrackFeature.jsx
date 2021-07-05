import React, { Component } from "react";
import { View, ScrollView, Text, ImageBackground, Dimensions, TouchableHighlight} from "react-native";
export default class TrackFeature extends Component{
    render(){
        let title;
        if (this.props.title === "energy"){
            title = "energetic"
        }else if (this.props.title === "acousticness"){
            title = "acoustic"
        }else if (this.props.title === "valence"){
            title="valent"
        }else if (this.props.title === "danceability"){
            title="danceable"
        }else if (this.props.title === "liveness"){
            title="live"
        }else{
            title = "instrumental"
        }
        return(
            <View style={{padding:10, borderRadius:10, backgroundColor:"rgb(20,20,20)", width:150, margin:5}}>
                <Text style={{color:"#1DB954", fontSize:25}}>{this.props.stat}</Text>
                <Text style={{color:"white", fontSize:20}}>of your top track are {title}</Text>
            </View>

        )
    }
}