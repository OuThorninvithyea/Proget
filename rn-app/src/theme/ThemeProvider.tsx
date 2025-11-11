import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

type Theme = {
	accent: string;
	bg: string;
	card: string;
	text: string;
	muted: string;
	border: string;
	shadowOpacity: number;
	isDark: boolean;
};

type ThemeContextValue = {
	theme: Theme;
	colorScheme: ColorSchemeName;
	setScheme: (scheme: ColorSchemeName) => void;
	fontsLoaded: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const systemScheme = Appearance.getColorScheme() ?? 'light';
	const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemScheme);

	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	const theme = useMemo<Theme>(() => {
		const isDark = colorScheme === 'dark';
		return {
			accent: '#6C5CE7',
			bg: isDark ? '#0b0f1a' : '#ffffff',
			card: isDark ? '#111827' : '#ffffff',
			text: isDark ? '#f3f4f6' : '#111827',
			muted: isDark ? '#9ca3af' : '#6b7280',
			border: isDark ? '#1f2937' : '#e5e7eb',
			shadowOpacity: isDark ? 0.25 : 0.06,
			isDark,
		};
	}, [colorScheme]);

	const value = useMemo<ThemeContextValue>(() => {
		return {
			theme,
			colorScheme,
			setScheme: setColorScheme,
			fontsLoaded,
		};
	}, [theme, colorScheme, fontsLoaded]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return ctx;
}


