import { locale } from '../localization/pl-pl'

// A bit rough attempt to i18n

export function GetNavigatorLanguage() {
    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
}

function Tr(text) {
    if (locale[text]) {
        return locale[text];
    }
    else {
        return text;
    }
}
export default Tr;

export function TrRange(number, label) {
    if (!locale[label]) {
        return label
    }
    else if (locale[label][number]) {
        return locale[label][number]
    }
    else {
        const l =  locale[label];
        // If it's not specified then return last defined term 
        // Bit dodgy, but should do the job. 
        return l[Object.keys(l)[Object.keys(l).length -1]]
    }
}


