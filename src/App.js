import { StatusBar } from "expo-status-bar";
import React from "react";
import {  View, Dimensions, StyleSheet, Text, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { BarChart, ProgressChart, ContributionGraph, PieChart, LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import Moment from 'moment';
import { Card, Image } from 'react-native-elements';
import { DataTable } from 'react-native-paper';

class App extends React.Component {
    state = {
        states: [],
        estado: [],
        twitter: []
    };
    componentDidMount() {
        fetch(base_url + '/apicov/states/')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    states: res.list
                });
            });

        fetch(base_url + '/apicov/state/sp')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    estado: res.list[0]
                });
            });

        fetch(base_url + '/apicov/tweets/sentiment')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    twitter: res.list
                });
            });
    }
    dataValuesBarChart(){
        var label = [];
        var cases = [];
        this.state.states.map(function(item, index){
            if(item.cases >= 300000){
                label[index] = item.state;
                cases[index] = item.cases;
            }
        });

       const data = {
            labels: label,
            datasets: [{
            data: cases
            }]
        }

        return data;
    }
    valuesPieChart(){
        var data = [];
        this.state.states.map(function(item, index){
            if(item.cases >= 300000){
                data[index] = { name: item.state, population: item.cases, color: randomColor(), legendFontColor: '#FFF', legendFontSize: 12  };
            }
        });      
        return data;
    }
    valuesProgressChart(){
        var data = [];
        var sum = null;
        this.state.states.map(function(item, index){
            sum += item.refuses;
        });  
        this.state.states.map(function(item, index){

            if(item.refuses >= 100){
                data.push(item.refuses/sum);
            }
            data.sort(function ( a, b ) { return b - a; } );
        });           
        return data;
    }
    valuetwitterChart(){ 
        var data = [];
      
        this.state.twitter.map(function(item, index){
            data = [{
                    name: "Positivo",
                    population:item.positive,
                    color:'rgba(0, 255, 200, 0.6)',
                    legendFontColor: 'rgba(0, 255, 200, 0.6)',
                    legendFontSize: 12
                },     
                {
                    name: "Neutro",
                    population: item.neutral,
                    color:'rgba(120, 120, 120, 0.6)',
                    legendFontColor: 'rgba(120, 120, 120, 0.6)',
                    legendFontSize: 12 
                },
                {
                    name: "Negativo",
                    population: item.negative,
                    color:'rgba(255, 115, 115, 0.6)',
                    legendFontColor: 'rgba(255, 115, 115, 0.6)',
                    legendFontSize: 12 
                }];
        }); 
        return data;
    }

    render (){
        return (
            <View style={styles.container}>
            <StatusBar backgroundColor="#2c314a" style='light'/>
                <SafeAreaView  backgroundColor='#2c314a'>
                    <ScrollView style={styles.ScrollView}>                   
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.cardTitle}> Grafico de Casos maior ou igual a 300000 </Card.Title>
                            <Card.Divider/>
                            <BarChart
                                data={this.dataValuesBarChart()}
                                width={screenWidth}
                                height={400}
                                chartConfig={chartConfig}
                                verticalLabelRotation={90}
                                bezier                     
                            />
                        </Card>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.cardTitle}>Grafico de Casos maior ou igual a 300000 </Card.Title>
                            <Card.Divider/>
                            <PieChart
                                data={this.valuesPieChart()}
                                width={screenWidth}
                                height={screenHeight}
                                chartConfig={chartConfig}
                                accessor="population"
                                backgroundColor="#27293d"
                                avoidFalseZero={true}
                            />
                        </Card>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.cardTitle}>Analise de sentimentos do twitter</Card.Title>
                            <Card.Divider/>
                            <PieChart
                                data={this.valuetwitterChart()}
                                width={screenWidth}
                                height={screenHeight}
                                chartConfig={chartConfig}
                                accessor="population"
                                backgroundColor="#27293d"
                                avoidFalseZero={true}
                            />
                        </Card>
                        <Card containerStyle={styles.card}>
                            <Card.Title style={styles.cardTitle}>Dados da Predição</Card.Title>
                            <Card.Divider/>
                            <Image
                            source={{ uri: 'https://oficinadeinovacao.herokuapp.com/static/prediction.png' }}
                            style={{ width: screenWidth, height: 300 }}
                            PlaceholderContent={<ActivityIndicator />}
                            />
                        </Card>     
                    </ScrollView>
                </SafeAreaView>
            </View>
        ); 
    }
}
const base_url = 'https://oficinadeinovacao.herokuapp.com'
const chartConfig = {
    backgroundGradientFrom: 'rgba(39, 41, 61, 0)',
    backgroundGradientTo: 'rgba(39, 41, 61, 0)',
    color: (opacity = 1) => `rgba(255, 64, 147, ${opacity})`,
    decimalPlaces:0.1,
    style: {
        borderRadius: 16,
    }
}

const screenWidth = Dimensions.get('window').width - 0.45 * 100;
const screenHeight = (Dimensions.get('window').height - 5.0 * 100) <= 220 ? 220 : Dimensions.get('window').height - 6.0 * 100;
const randomColor = () => '#' + Math.random().toString(16).slice(2, 8);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: '#2c314a',
    },
    scrollView: {
        backgroundColor: '#2c314a',
        marginHorizontal: 0,
    },
    card : {
        backgroundColor:"#27293d",
        elevation: 0, 
        borderColor: "#27293d"
    },
    cardTitle : {
        color: "white",
    }
});

export default App;
