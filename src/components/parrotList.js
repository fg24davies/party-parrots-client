import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, SafeAreaView } from 'react-native';
import Parrot from './parrot';
import styles from '../../styles';
import { Headbar } from './headbar';

const ParrotList = ({ navigation }) => {
	const [parrots, setParrots] = useState([]);

	useEffect(async () => {
		console.log('fetch data in use effect');
		const res = await fetch(`http://localhost:3000/api/parrots`, {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((data) => {
				setParrots(data);
			});
	}, []);

	return (
		<SafeAreaView>
			<Headbar/>
			<View>
				<Button title="Add Parrot" onPress={() => navigation.navigate('Add Parrot')}/>
				<FlatList
					data={parrots}
					renderItem={({ item }) => (
						<Parrot
							key={item._id}
							name={item.name}
							imgUrl={item.imageUrl ? item.imageUrl : 'https://picsum.photos/200'}
						/>
					)}
					keyExtractor={(item) => item._id}
				/>
			</View>
		</SafeAreaView>				
	);
};

export { ParrotList };
