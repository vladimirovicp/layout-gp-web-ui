// Description: Mock data for images
import { TYPES } from './constants.js';

export const images = [
  {
    type: TYPES.FOLDER,
    name: 'Fruits',
    modified: new Date('2020-07-06'),
    size: 0,
    children: [
      {
        type: TYPES.FILE,
        name: 'apple.img',
        modified: new Date('2020-07-06'),
        size: 1024,
      },
      {
        type: TYPES.FILE,
        name: 'banana.img',
        modified: new Date('2020-07-06'),
        size: 1024,
      },
    ],
  },
  {
    type: TYPES.FOLDER,
    name: 'Vegetables',
    modified: new Date('2020-07-06'),
    size: 0,
    children: [
      {
        type: TYPES.FILE,
        name: 'cabbage.img',
        modified: new Date('2020-07-06'),
        size: 1024,
      },
    ],
  },
];