import React, { Component } from "react";
import { View, ScrollView, Text, ImageBackground, Dimensions, TouchableHighlight} from "react-native";
export default class TrackCard extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <TouchableHighlight onPress={() => {this.props.showScreen({screen:"artist",artist:{id:this.props.id}})}}>
                <ImageBackground source={{uri:this.props.image}} style={{width:(Dimensions.get("window").width/2)-20, height:150, justifyContent:"space-between", padding:10, margin:5}} imageStyle={{borderRadius:10, opacity:0.7}}>
                    <Text style={{color:"white", fontSize:25, textShadowColor:"black", textShadowRadius:5, fontWeight:"bold"}}>#{this.props.index+1}</Text>
                    <Text style={{color:"white", fontSize:20, textShadowColor:"black", textShadowRadius:5}}>{this.props.name}</Text>
                </ImageBackground>
            </TouchableHighlight>

        )
    }
}