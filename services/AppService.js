// all application constants

export const MONGODB_DATABASE = 'clipboardmanager';
export const MONGODB_COLLECTION_BOARDS = 'boards'
export const MONGODB_COLLECTION_BOARD_ITEM = 'boardItem';

export const USERID = 'userId';

export const RANDOM_TITLES = [
    'Grocery List',
    'Shopping List',
    'School List',
    'Kids Names',
    'List of Miracles',
    'Recipes',
    'My Organs',
    'To do or not todo',
    'My Oh My!',
    'Days of the week',
    'Uh oh, forgot to set a title',
    'I can not think of anything else',
    'Test',
    'Try Again',
    'Just Kidding',
];



// thank you mozilla
export function getRandomInt(max=1000000) {
    return Math.floor(Math.random() * max);
}

export function getRandomIntInclusive(min = 0, max = RANDOM_TITLES.length) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function generateRandomTitle() {
    return RANDOM_TITLES[getRandomIntInclusive()];
}
