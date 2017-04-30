import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
/*
	https://github.com/Exilz/react-native-calendarevents-android
*/
import Calendar from 'react-native-calendarevents-android';
import {
  Text,
  AppRegistry,
  TextInput,
  View,
  Button,
  Alert,
  ScrollView,
  Picker,
  DatePickerAndroid,
  Image,
  Linking
} from 'react-native';


// Ajoute un jour à la date
// Permet de passer correctement au mois suivant si le jour est le dernier du mois
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

class SearchForm extends Component {

	constructor(props) {
		super(props);
		// Bind le this courant à la fonction
		this.onPressSearch = this.onPressSearch.bind(this);
		this.state = {
			location: '',
			guests: 1,			
			dateCheckin: new Date(),
			dateCheckOut: new Date().addDays(1),
			searchResult: []
		};

	}

	// Recherche quand on appuie sur le bouton
	onPressSearch() {
		// Teste les dates
		if((Date.parse(this.state.dateCheckin) > Date.parse(this.state.dateCheckOut)) || (Date.parse(this.state.dateCheckin) == Date.parse(this.state.dateCheckOut))){
			alert("La date de début ne peut pas être supérieure ou égale à la date de fin");
		} else {
		 	// Appel sur l'API
		 	fetch('https://www.airbnb.fr/search/search_results/?location='+ this.state.location +'&guests='+ this.state.guests +'&checkin='+ this.state.dateCheckin +'&checkout='+ this.state.dateCheckOut +'')
			 	.then((response) => response.json())
			 	.then((responseJson) => {
			    	// responseJson.search_results contient les résultats de la recherche
			    	if(responseJson.results_json.search_results && responseJson.results_json.search_results.length > 0) {
				 		this.setState({searchResult : responseJson.results_json.search_results});
				 		console.log(this.state.searchResult);
			    	}
			 	})
			 	.catch((error) => {
			 		console.error(error);
			 	});
		}

	};

	// Affiche le date picker
	showDatePicker = async (stateKey, options) => {
		try {
		  const {action, year, month, day} = await DatePickerAndroid.open({
		    date: new Date()
		  });
		} catch ({code, message}) {
		  console.warn('Cannot open date picker', message);
		}
	};

	sendSMS(title, checkinDate, checkoutDate) {
		var url = "sms:?body=Je viens de trouver un bon hôtel Airbnb : '"+title+"' disponible du "+ checkinDate +" au "+ checkoutDate +" ! - Envoyé avec Find My Airbnb (React)";
		Linking.openURL(url).catch(err => console.error('Cannot open SMS app', err));
	}

	addToCalendar(title, location, checkinDate, checkoutDate){
		Calendar.addEvent(
		    {
		        title: title,
		        startDate: checkinDate,
		        endDate: checkoutDate,
		        description: 'Ma réservation pour : ' + title,
		        location: location
		    },
		    (success) => console.log(success),
		    (error) => console.log(error)
		);
	}

	render() {
		return (
			<View style={{flex: 1, flexDirection: 'column', margin: 10}}>
				<Text style={{margin: 10}}>
					{"\n"}
					Ville:
				</Text>
				<TextInput
					style={{width: "100%", height: 50}}
					placeholder="Ex: Lille, Dijon, Marseille"
					value="Arras"
					onChangeText={(location) => this.setState({location})}
				/>
				<Text style={{margin: 10}}>
					{"\n"}
					Nombre de voyageur:
				</Text>
				<Picker selectedValue={this.state.guests} onValueChange={(guests) => this.setState({guests})}>
					<Picker.Item label="1" value="1" />
					<Picker.Item label="2" value="2" />
					<Picker.Item label="3" value="3" />
					<Picker.Item label="4" value="4" />
					<Picker.Item label="5" value="5" />
					<Picker.Item label="6" value="6" />
					<Picker.Item label="7" value="7" />
					<Picker.Item label="8" value="8" />
					<Picker.Item label="9" value="9" />
					<Picker.Item label="10" value="10" />
				</Picker>
				<Text style={{margin: 10}}>
					{"\n"}
					Date de début:
				</Text>
				<DatePicker
					style={{width: "100%"}}
					date={this.state.dateCheckin}
					mode="date"
					placeholder="Date de début"
					format="YYYY-MM-DD"
					confirmBtnText="Valider"
					cancelBtnText="Annuler"
					customStyles={{
						dateIcon: {
							position: 'absolute',
							left: 0,
							top: 4,
							marginLeft: 0
						},
						dateInput: {
							marginLeft: 36
						}
					}}
					onDateChange={(dateCheckin) => {this.setState({dateCheckin})}}
				/>
				<Text style={{margin: 10}}>
					{"\n"}
					Date de fin:
				</Text>
				<DatePicker
					style={{width: "100%"}}
					date={this.state.dateCheckOut}
					mindate={this.state.dateCheckOut}
					mode="date"
					placeholder="Date de début"
					format="YYYY-MM-DD"
					confirmBtnText="Valider"
					cancelBtnText="Annuler"
					customStyles={{
						dateIcon: {
							position: 'absolute',
							left: 0,
							top: 4,
							marginLeft: 0
						},
						dateInput: {
							marginLeft: 36
						}
					}}
					onDateChange={(dateCheckOut) => {this.setState({dateCheckOut})}}
				/>
				<Text>{"\n"}{"\n"}</Text>
				<Button
					onPress={this.onPressSearch}
					title="Rechercher"
				/>
				<View style={{marginTop: 20}}>
					<ScrollView id="results">
						<Text style={{fontSize: 20, fontWeight: 'bold'}}>
							Résultats{"\n"}{"\n"}
						</Text>
						{
							this.state.searchResult.map(item => (
								<View key={item.listing.name}>
									<Text>{"\n"}</Text>
									<Text style={{fontWeight: 'bold'}}>{item.listing.name}</Text>
									<Image
							          style={{width: 100, height: 100, margin: 10}}
							          source={{ uri: item.listing.picture_url }}
							        />
									<Text>{item.listing.localized_city + ' - ' + item.listing.property_type + ' - Max: ' + item.listing.person_capacity + ' personne(s) - ' + item['pricing_quote']['rate'].amount + ' ' + item['pricing_quote']['rate'].currency}</Text>
									<Button
										onPress={this.sendSMS.bind(null, item.listing.name, this.state.dateCheckin, this.state.dateCheckOut)}
										title="Partager"
									/>
									<Text>{"\n"}</Text>
									<Button
										onPress={this.addToCalendar.bind(null, item.listing.name, item.listing.localized_city, this.state.dateCheckin, this.state.dateCheckOut)}
										title="Réserver"
									/>

									<Text>______________</Text>
								</View>
							))
						}
					</ScrollView>
				</View>
			</View>
		);
	}
}

export default SearchForm;