import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { getItem, setItem } from '../utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

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
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	actualScheme: ColorSchemeName;
	fontsLoaded: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
	const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');
	const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
	const [isReady, setIsReady] = useState(false);

	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	// Load saved theme preference on mount
	useEffect(() => {
		(async () => {
			const saved = await getItem('theme:mode');
			if (saved === 'light' || saved === 'dark' || saved === 'system') {
				setThemeModeState(saved);
			}
			setIsReady(true);
		})();
	}, []);

	// Listen to system theme changes
	useEffect(() => {
		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setSystemScheme(colorScheme ?? 'light');
		});
		return () => subscription.remove();
	}, []);

	// Save theme preference when it changes
	const setThemeMode = (mode: ThemeMode) => {
		setThemeModeState(mode);
		setItem('theme:mode', mode);
	};

	// Determine actual color scheme based on mode
	const actualScheme: ColorSchemeName = themeMode === 'system' ? systemScheme : themeMode;

	const theme = useMemo<Theme>(() => {
		const isDark = actualScheme === 'dark';
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
	}, [actualScheme]);

	const value = useMemo<ThemeContextValue>(() => {
		return {
			theme,
			themeMode,
			setThemeMode,
			actualScheme,
			fontsLoaded: fontsLoaded && isReady,
		};
	}, [theme, themeMode, actualScheme, fontsLoaded, isReady]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useTheme must be used within ThemeProvider');
	}
	return ctx;
}


