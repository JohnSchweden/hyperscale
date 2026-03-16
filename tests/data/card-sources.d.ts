declare const cardSources: {
	sources: Array<{
		cardId: string;
		incidentName: string;
		url?: string;
		date: string;
		category: string;
		reason: string;
		fictional?: boolean;
	}>;
};

export default cardSources;
