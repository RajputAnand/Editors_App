interface PermissionData {
    label: string;
    value: number;
}

interface JsonData {
    [key: string]: PermissionData;
}

interface ExtractedData {
    [key: string]: number;
}

export function extractKeyValuePairs(jsonData: JsonData): ExtractedData {
    const result: ExtractedData = {};

    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            result[key] = jsonData[key].value;
        }
    }

    return result;
}

export const getValue = (array: Array<any>, value: any) => {
    return array.filter((_) => _.value == value)?.[0]
}