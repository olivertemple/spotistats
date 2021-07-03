import React, { Component } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from "react-native-gesture-handler";

export default class Button extends Component{
    render(){
        return(
            <TouchableHighlight onPress={this.props.click} underlayColor={"#00000000"}>
                <View style={{backgroundColor:this.props.color, borderRadius:10, margin:10}}>
                    <Text style={{textAlign:"center", padding:10, fontSize:25, color:"white"}}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
            
        )
    }
}