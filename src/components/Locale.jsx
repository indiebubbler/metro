import { locale } from '../localization/pl-pl'

function Tr(text) {
    if (locale[text]) {
        return locale[text];
    }
    else {
        return text;
    }
    // getText(source) {
    //     return locale[source]
    // }

}


export default Tr;