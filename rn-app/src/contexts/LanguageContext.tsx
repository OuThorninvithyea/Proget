import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';

export type Language = 'en' | 'km';

interface LanguageContextValue {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const translations = {
	en: {
		// Navigation
		home: 'Home',
		tickets: 'My Tickets',
		marketplace: 'Marketplace',
		account: 'Account',
		
		// Home Screen
		welcome: 'Welcome Back',
		exploreEvents: 'Explore Events',
		recommendedForYou: 'Recommended for you',
		viewAll: 'View All',
		
		// Event Details
		eventDetails: 'Event Details',
		selectSeats: 'Select Seats',
		buyTickets: 'Buy Tickets',
		venue: 'Venue',
		date: 'Date',
		time: 'Time',
		price: 'Price',
		
		// Tickets
		myTickets: 'My Tickets',
		noTickets: 'No tickets yet',
		noTicketsDesc: 'Your purchased tickets will appear here',
		tapForDetails: 'Tap for details',
		
		// Account
		profile: 'Profile',
		settings: 'Settings',
		editProfile: 'Edit Profile',
		paymentMethods: 'Payment Methods',
		orderHistory: 'Order History',
		notifications: 'Notifications',
		language: 'Language',
		privacy: 'Privacy',
		logout: 'Logout',
		
		// Common
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		remove: 'Remove',
		confirm: 'Confirm',
		back: 'Back',
		next: 'Next',
		done: 'Done',
		search: 'Search',
	},
	km: {
		// Navigation
		home: 'ទំព័រដើម',
		tickets: 'សំបុត្ររបស់ខ្ញុំ',
		marketplace: 'ទីផ្សារ',
		account: 'គណនី',
		
		// Home Screen
		welcome: 'សូមស្វាគមន៍',
		exploreEvents: 'ស្វែងរកព្រឹត្តិការណ៍',
		recommendedForYou: 'សម្រាប់អ្នក',
		viewAll: 'មើលទាំងអស់',
		
		// Event Details
		eventDetails: 'ព័ត៌មានលម្អិត',
		selectSeats: 'ជ្រើសរើសកន្លែងអង្គុយ',
		buyTickets: 'ទិញសំបុត្រ',
		venue: 'ទីតាំង',
		date: 'កាលបរិច្ឆេទ',
		time: 'ពេលវេលា',
		price: 'តម្លៃ',
		
		// Tickets
		myTickets: 'សំបុត្ររបស់ខ្ញុំ',
		noTickets: 'មិនទាន់មានសំបុត្រ',
		noTicketsDesc: 'សំបុត្រដែលបានទិញនឹងបង្ហាញនៅទីនេះ',
		tapForDetails: 'ចុចដើម្បីមើលព័ត៌មានលម្អិត',
		
		// Account
		profile: 'ប្រវត្តិរូប',
		settings: 'ការកំណត់',
		editProfile: 'កែប្រែប្រវត្តិរូប',
		paymentMethods: 'វិធីសាស្ត្របង់ប្រាក់',
		orderHistory: 'ប្រវត្តិការបញ្ជាទិញ',
		notifications: 'ការជូនដំណឹង',
		language: 'ភាសា',
		privacy: 'ភាពឯកជន',
		logout: 'ចាកចេញ',
		
		// Common
		save: 'រក្សាទុក',
		cancel: 'បោះបង់',
		delete: 'លុប',
		edit: 'កែសម្រួល',
		add: 'បន្ថែម',
		remove: 'យកចេញ',
		confirm: 'បញ្ជាក់',
		back: 'ថយក្រោយ',
		next: 'បន្ទាប់',
		done: 'រួចរាល់',
		search: 'ស្វែងរក',
	},
};

export function LanguageProvider({ children }: { children: React.ReactNode }): React.ReactElement {
	const [language, setLanguageState] = useState<Language>('en');
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const loadLanguage = async () => {
			try {
				const saved = await getItem('language');
				if (saved === 'en' || saved === 'km') {
					setLanguageState(saved);
				}
			} catch (error) {
				console.error('Failed to load language:', error);
			} finally {
				setIsReady(true);
			}
		};
		loadLanguage();
	}, []);

	const setLanguage = async (lang: Language) => {
		setLanguageState(lang);
		await setItem('language', lang);
	};

	const t = (key: string): string => {
		return translations[language][key as keyof typeof translations.en] || key;
	};

	if (!isReady) {
		return <></>;
	}

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage(): LanguageContextValue {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within LanguageProvider');
	}
	return context;
}

