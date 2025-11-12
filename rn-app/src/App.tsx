import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

function AppShell(): JSX.Element {
	const { theme, fontsLoaded } = useTheme();
	if (!fontsLoaded) return <></>;
	return (
		<NavigationContainer theme={theme.isDark ? DarkTheme : DefaultTheme}>
			<StatusBar style={theme.isDark ? 'light' : 'dark'} />
			<RootNavigator />
		</NavigationContainer>
	);
}

export default function App(): JSX.Element {
	return (
		<AuthProvider>
			<LanguageProvider>
				<ThemeProvider>
					<AppShell />
				</ThemeProvider>
			</LanguageProvider>
		</AuthProvider>
	);
}

