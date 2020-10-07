import { StatusBar } from "expo-status-bar";
import React from "react";
import {  View, Dimensions, StyleSheet, Text, SafeAreaView, ScrollView } from "react-native";
import { BarChart, ProgressChart, ContributionGraph, PieChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import Moment from 'moment';
import { Card } from 'react-native-elements';
import { DataTable } from 'react-native-paper';

class App extends React.Component {
    state = {
        states: [],
        estado: []
    };
    componentDidMount() {
        fetch('http://caddev.pythonanywhere.com/api/states/')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    states: res.list
                });
            });

        fetch('http://caddev.pythonanywhere.com/api/state/sp')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    estado: res.list[0]
                });
            });
    }
    dataValuesBarChart(){
        var label = [];
        var cases = [];
        this.state.states.map(function(item, index){
            if(item.cases >= 250000){
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
    valuesContributionGraph(){
        var label = [];
        var cases = [];
        var data = [];
        var formatDate;
        var dateFormated;
        this.state.states.map(function(item, index){
            if(item.cases >= 100000){
                formatDate = item.datetime.split('-')
                dateFormated = formatDate[2]+'-'+formatDate[1]+'-'+formatDate[0];
                label[index] = item.datetime;
                cases[index] = item.cases;
                data[index] = { date: Moment(dateFormated).format('YYYY-MM-DD'), count: item.cases };
            }
        });
        const values = data;
       
        return values;
    }
    valuesPieChart(){
        var data = [];
        this.state.states.map(function(item, index){
            if(item.cases >= 100000){
                data[index] = { name: item.state, population: item.cases, color: randomColor(), legendFontColor: 'rgba(26, 255, 146,1)', legendFontSize: 12 };
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

    render (){
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <SafeAreaView >
                    <ScrollView style={styles.ScrollView}>                   
                        <Card>
                            <Card.Title> Grafico de Casos maior ou igual a 250000 </Card.Title>
                            <Card.Divider/>
                            <BarChart
                                data={this.dataValuesBarChart()}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                            />
                        </Card>
                       
                        <Card>
                            <Card.Title>Grafico de Casos maior ou igual a 100000 </Card.Title>
                            <Card.Divider/>
                            <ProgressChart
                                data={this.valuesProgressChart()}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                strokeWidth={10}
                                radius={10}
                                bezier
                            />
                        </Card>

                        <Card>
                            <Card.Title>Grafico de Casos maior ou igual a 100000 </Card.Title>
                            <Card.Divider/>
                            <PieChart
                                data={this.valuesPieChart()}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                accessor="population"
                                backgroundColor="#1E2923"
                                avoidFalseZero={true}
                            />
                        </Card>
              
                        <Card>
                            <DataTable style={{textAlign: 'center'}}>

                                <DataTable.Header style={{textAlign: 'center'}}>
                                    <DataTable.Title>#</DataTable.Title>
                                    <DataTable.Title>Estado</DataTable.Title>
                                    <DataTable.Title>Casos</DataTable.Title>
                                </DataTable.Header>

                                {this.state.states.map((item, index) =>{
                                return(
                                    <View key={index} style={styles.user}>
                                        <DataTable.Row style={{textAlign: 'center'}}>
                                            <DataTable.Cell>{parseInt(index) + parseInt(1)}</DataTable.Cell>
                                            <DataTable.Cell>{item.state}</DataTable.Cell>
                                            <DataTable.Cell numeric>{item.cases}</DataTable.Cell>
                                        </DataTable.Row>
                                    </View>
                                );
                            })}
                            </DataTable>
                        </Card>
                    
                    </ScrollView>
                </SafeAreaView>
            </View>
        ); 
    }
}

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    decimalPlaces:0.1,
    style: {
        borderRadius: 16,
    }
}
const screenWidth = 350
const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        backgroundColor: 'black',
        marginHorizontal: 0,
    },
});

export default App;
