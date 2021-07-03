import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight} from 'react-native';

export default class NavBar extends Component{
    render(){
        return(
            <View style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly", paddingTop:10, paddingBottom:10, position:"absolute", bottom:0, backgroundColor:"black", width:"100%"}}>
                <TouchableHighlight onPress={() => {this.props.showScreen({screen:"overview"})}}>
                    <Text style={[styles.GeneralText,{color:this.props.active==="home" ? "#1DB954" : "white"}]}>Home</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.props.showScreen({screen:"top"})}}>
                    <Text style={[styles.GeneralText,{color:this.props.active==="top" ? "#1DB954" : "white"}]}>Top</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => {this.props.showScreen({screen:"stats"})}}>
                    <Text style={[styles.GeneralText,{color:this.props.active==="stats" ? "#1DB954" : "white"}]}>Stats</Text>
                </TouchableHighlight>
                <TouchableHighlight>
                    <Text style={[styles.GeneralText,{color:this.props.active==="charts" ? "#1DB954" : "white"}]}>Charts</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    GeneralText:{
        color:"white",
        fontSize:20
    }
})