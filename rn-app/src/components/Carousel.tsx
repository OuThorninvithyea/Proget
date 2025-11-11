import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Carousel({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<View style={styles.wrapper}>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
				{children}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: { width: '100%' },
	content: { paddingHorizontal: 16, paddingVertical: 8 },
});


