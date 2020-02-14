const fs = require('fs');
const path = require('path');

const startingPath = path.join(__dirname, 'locales')

// The main langauge that all other languages will try to emulate
const mainLanguage = 'en';

const otherLanguages = [
	'ru',
	'zh',
	'vi',
	'no'
];

const mainLanguageDir = path.join(startingPath, mainLanguage);
const mainLanguageFiles = fs.readdirSync(mainLanguageDir);

otherLanguages.forEach((language) => {
	console.log(language)

	const thisLanguageDir = path.join(startingPath, language);

	// Ensure a directory exists for this language
	if(!fs.existsSync(thisLanguageDir)) {
		fs.mkdirSync(thisLanguageDir);
	}

	// Do the files exist?
	mainLanguageFiles.forEach((languageFile) => {
		const languagePath = path.join(thisLanguageDir, languageFile);
		const referencePath = path.join(mainLanguageDir, languageFile);

		// If it doesn't exist, just copy the reference language
		if(!fs.existsSync(languagePath)) {
			fs.copyFileSync(referencePath, languagePath);
		} else {
			// If it does exist, search for missing keys and add them
			try {
				let ourLanguageFile, referenceLanguageFile;
				try {
					ourLanguageFile = JSON.parse(fs.readFileSync(languagePath));
					referenceLanguageFile = JSON.parse(fs.readFileSync(referencePath));
				} catch(e) {
					console.log(e);
					console.log('Failed to parse ' + languageFile + ' for ' + language);
					return;
				}
				

				let madeChange = false;

				for(let key in referenceLanguageFile) {
					if(!ourLanguageFile.hasOwnProperty(key)) {
						ourLanguageFile[key] = referenceLanguageFile[key];
						madeChange = true;
					}
				}

				// If we made a change, save it
				if(madeChange) {
					fs.writeFileSync(languagePath, JSON.stringify(ourLanguageFile, null, 4));
				}
			} catch(e) {
				console.log(e);
				console.log('Failed to parse ' + languageFile);
			}
		}
	});
});