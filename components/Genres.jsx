import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight, Image, Dimensions, ScrollView } from 'react-native';
import DropDown from "./stats/DropDown";
const Back = require("../assets/left-arrow.png");

export default class Genres extends Component{
    render(){
        console.log(this.props)
        return(
            <ScrollView style={{margin:10, marginBottom:40}}>
                <View style={{flexDirection:"row", alignItems:"center", width:Dimensions.get("window").width}}>
                    <TouchableHighlight onPress={this.props.back} underlayColor={"#00000000"}>
                        <Image source={{ uri:String(Back) }} style={{width:20, height:20}}></Image>
                    </TouchableHighlight>
                    <Text style={{color:"white",fontSize:25, textAlign:"center", width:Dimensions.get("window").width - 60}}>Genres</Text>
                </View>
                {
                    this.props.genres.map(item => {
                        return(
                            <DropDown title={item[1]} subtitle={item[0]} data={this.props.artistGenres[item[1]]} showScreen={this.props.showScreen} topArtists={this.props.topArtists}></DropDown>
                            
                        )
                    })
                }
            </ScrollView>
        )
    }
}
