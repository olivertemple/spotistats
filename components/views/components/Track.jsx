import React, { Component } from "react";
import { StyleSheet, Text, View, Image, ImageBackground, Dimensions, ScrollView, TouchableHighlight, BackHandler} from 'react-native';

export default class Track extends Component{
    constructor(props){
        super(props)
        this.showSong = this.showSong.bind(this)
    }

    showSong(){
        this.props.showScreen({
            screen:"song",
            song:{
                id:this.props.id
            }
        })
    }

    getExtraText(){
        if (this.props.index){
            return(
                <Text style={{color:"#1DB954", fontSize:25, marginRight:10}}>{this.props.index}</Text>

            )
        }else if(this.props.time){
            return(
                <Text style={{color:"#555555", marginRight:10, fontSize:15}}>{this.props.time}</Text>
            )
        }
    }

    render(){
        let textWidth = Dimensions.get("window").width - 150
        return(
            <TouchableHighlight onPress={this.showSong} style={{borderRadius:10, marginLeft:5, marginRight:5, marginTop:5}}>
                <View style={{display:"flex",flexDirection:"row", justifyContent:"space-between", padding:10, backgroundColor:"rgb(20,20,20)", borderRadius:10, alignItems:"center"}}>
                    {this.getExtraText()}
                   
                    <View style={{width:textWidth}}>
                        <Text style={{color:"white",fontSize:20, fontWeight:"bold"}}>{this.props.name}</Text>
                        <Text style={{color:"white",fontSize:15}}>{this.props.artists}</Text>
                    </View>
                    <Image source={{ uri:this.props.image }} style={{width:50, height:50, borderRadius:10}}></Image>
                </View>
            </TouchableHighlight>
        )
    }
}