export const Categories = [
    { id: 'groceries', label: 'Groceries', color: '#7A95FF', icon: 'food-variant' },      //blue 
    { id: 'dining', label: 'Dining', color: '#FF7A7A', icon: 'food' },          //red
    { id: 'bills', label: 'Bills', color: '#FFB17A', icon: 'home-alert-outline' },              //brown
    { id: 'activities', label: 'Activities', color: '#FFE47A', icon: 'ferris-wheel' },    //yellow
    { id: 'health', label: 'Health', color: '#95FF7A', icon: 'heart-pulse' },            //green
    { id: 'shopping', label: 'Shopping', color: '#E47AFF', icon: 'shopping' },        //purple
    { id: 'other', label: 'Other', color: '#666666', icon: 'robot-confused' }               //grey
] as const;

export type CategoryId = (typeof Categories)[number]['id'];

const UNCATEGORIZED = { id: 'uncategorized', label: 'Uncategorized', color: '#666666', icon: 'robot-confused' } as const;

export function getCategory(id: string | null | undefined) {
    return Categories.find((c) => c.id === id) ?? UNCATEGORIZED;
}

export function getContrastText(hex: string) {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);

    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    if (luminance > 0.6) {
        return '#000000';
    }
    return '#ffffff';

}