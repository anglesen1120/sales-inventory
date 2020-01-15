//https://github.com/sevensc/typescript-string-operations/tree/master/dist

export class String {
    static DECIMAL_SEPARATOR: string = ".";
    static THOUSANDS_SEPARATOR: string = ",";

    public static Empty: string = "";

    public static IsContainLetters(value: string) {
        return /^[a-zA-Z]+$/.test(value);
    }

    public static IsContainNumbers(value: string) {
        return /[\d\s\._\-_\,]+/g.test(value);
    }

    public static IsEmailFormat(value: string) {
        let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        return (value.length > 5 && EMAIL_REGEXP.test(value));
    }

    public static IsNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value == 'undefined') {
                return true;
            }
            return value.toString().replace(/\s/g, '').length < 1;
        } catch (e) {
            return false;
        }
    }

    public static Join(delimiter: string, ...args: (string | object | Array<any>)[]): string {
        try {
            let firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = String.Empty;
                let count = 0;

                for (let i = 0; i < firstArg.length; i++) {
                    let current = firstArg[i];
                    if (i < firstArg.length - 1)
                        tempString += current + delimiter;
                    else
                        tempString += current;
                }

                return tempString;
            }
            else if (typeof firstArg === 'object') {
                let tempString = String.Empty;
                let objectArg = firstArg;
                let keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += (<any>objectArg)[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }
            let stringArray = <string[]>args;

            return String.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    }

    public static FormatInputNumber(arg: any): string {
        let svalue = arg.toString();
        let regex = new RegExp('[^' + this.DECIMAL_SEPARATOR + '\\d]', 'g'),
            number_string = svalue.replace(regex, ''),
            split = number_string.split(this.DECIMAL_SEPARATOR),
            rest = split[0].length % 3,
            result = split[0].substr(0, rest),
            thousands = split[0].substr(rest).match(/\d{3}/g);
        if (thousands) {
            let separator = rest ? this.THOUSANDS_SEPARATOR : '';
            result += separator + thousands.join(this.THOUSANDS_SEPARATOR);
            if (arg < 0) 
                result = "-" + result;     
        }
        return result = split[1] != undefined ? result + this.DECIMAL_SEPARATOR + split[1] : result;
    }


    public static ConvertInputNumber(arg: string): number {
        return parseFloat(arg.replace(new RegExp('[' + String.THOUSANDS_SEPARATOR + ']', 'g'), '').replace(new RegExp('[' + String.DECIMAL_SEPARATOR + ']', 'g'), String.THOUSANDS_SEPARATOR));
    }

    public static Format(format: string, ...args: any[]): string {
        try {
            return format.replace(/{(\d+(:\w*)?)}/g, function (match, i) { //0
                let s = match.split(':');
                if (s.length > 1) {
                    i = i[0];
                    match = s[1].replace('}', ''); //U
                }

                //let arg = args[i];
                let arg = args[0][i];
                if (arg == null || arg == undefined || match.match(/{d+}/))
                    return arg;

                arg = String.parsePattern(match, arg);
                return typeof arg != 'undefined' && arg != null ? arg : String.Empty;
            });
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    }

    public static FormatNumber(arg: number): string {
        try {
            let c = '-';
            let sarg = arg.toString();
            let firstChar = '';

            if (sarg[0] === c) {
                firstChar = c;
                sarg = sarg.substring(1, sarg.length);
            }

            let spls = sarg.split(String.THOUSANDS_SEPARATOR);
            let result = spls[0].replace(new RegExp(String.THOUSANDS_SEPARATOR, 'g'), function (c: any, i: any, a: any) {
                return i && c !== String.DECIMAL_SEPARATOR && ((a.length - i) % 3 === 0) ? String.THOUSANDS_SEPARATOR + c : c;
            });

            return firstChar + result + (spls.length == 2 ? String.DECIMAL_SEPARATOR + spls[1] : '');
        }
        catch (e) {
            return String.Empty;
        }
    }


    public static FormatDateTime(arg: Date): string {
        return arg.toLocaleString('en-GB').replace(',','');
    }

    private static parsePattern(match: 'L' | 'U' | 'd' | 's' | 'n' | string, arg: string | Date | number | any): string {
        switch (match) {
            case 'L':
                arg = arg.toLowerCase();
                return arg;
            case 'U':
                arg = arg.toUpperCase();
                return arg;
            case 'd':
                if (typeof (arg) === 'string') {
                    return String.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return String.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            case 's':
                if (typeof (arg) === 'string') {
                    return String.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return String.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            case 'n': //Tausender Trennzeichen
                let replacedString = arg.replace(/,/g,'.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3)
                    break;

                let numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;

                if(numberparts.length > 1){
                    parts = [String.join('',...(numberparts.splice(0, numberparts.length -1 ))), numberparts[numberparts.length-1]];
                }

                let integer = parts[0];

                var mod = integer.length % 3;
                var output = (mod > 0 ? (integer.substring(0, mod)) : String.Empty);
                var firstGroup = output;
                var remainingGroups = integer.substring(mod).match(/.{3}/g);
                output =  output + '.' + String.Join('.',remainingGroups);
                arg = output + (parts.length > 1 ? ','+ parts[1] : '');
                return arg;
            default:
                break;
        }

        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !String.IsNullOrWhiteSpace(arg))
            return String.formatNumber(arg, match);

        return arg;
    }

    private static getDisplayDateFromString(input: string): string {
        let splitted: string[];
        splitted = input.split('-');

        if (splitted.length <= 1)
            return input;

        let day = splitted[splitted.length - 1];
        let month = splitted[splitted.length - 2];
        let year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];

        return `${day}.${month}.${year}`;
    }

    private static getSortableDateFromString(input: string): string {
        let splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1)
            return input;

        let times = splitted[splitted.length - 1].split(' ');
        let time = String.Empty;
        if (times.length > 1)
            time = times[times.length - 1];        

        let year = splitted[splitted.length - 1].split(' ')[0];
        let month = splitted[splitted.length - 2];
        let day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`
    
        if (!String.IsNullOrWhiteSpace(time) && time.length > 1)
            result += `T${time}`;
        else
            result += "T00:00:00";        

        return result;
    }

    private static formatNumber(input: number, formatTemplate: string): string {
        let count = formatTemplate.length;
        let stringValue = input.toString();   
        if (count <= stringValue.length)
            return stringValue;

        let remainingCount = count - stringValue.length;
        remainingCount += 1; //Das Array muss einen Eintrag mehr als die benötigten Nullen besitzen
        return new Array(remainingCount).join('0') + stringValue;
    }

    private static join(delimiter: string, ...args: string[]): string {
        let temp = String.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && String.IsNullOrWhiteSpace(args[i])) || (typeof args[i] != "number" && typeof args[i] != "string"))
                continue;

            let arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (String.IsNullOrWhiteSpace(args[i2]))
                    continue;

                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }
        return temp;
    }
}

export class StringBuilder {
    public Values: string[] = [];

    constructor(value: string = String.Empty) {
        this.Values = new Array(value);
    }
    public ToString() {
        return this.Values.join('');
    }
    public Append(value: string) {
        this.Values.push(value);
    }
    public AppendFormat(format: string, ...args: any[]) {
        this.Values.push(String.Format(format, ...args));
    }
    public Clear() {
        this.Values = [];
    }
}
