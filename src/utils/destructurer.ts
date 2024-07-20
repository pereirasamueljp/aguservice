import { isArray, pick as lodashPick } from "lodash";

export function pick<T>(object: T | T[], attributes: string[]) {
    if (!attributes) return object
    if (isArray(object)) return object.map(value => { return lodashPick(value, attributes) })
    return lodashPick(object,attributes)
}