// Description: Data for the file explorer

import { documents } from './documents.js';
import { images } from './images.js';
import { TYPES } from './constants.js';

export const data = [
  {
    type: TYPES.FOLDER,
    name: 'Files',
    modified: new Date('2020-07-06'),
    size: 0,
    children: [
      {
        type: TYPES.FOLDER,
        name: 'Documents',
        modified: new Date('2020-07-06'),
        size: 0,
        children: documents,
      },
      {
        type: TYPES.FOLDER,
        name: 'Images',
        modified: new Date('2020-07-06'),
        size: 0,
        children: images,
      },
      {
        type: TYPES.FOLDER,
        name: 'System',
        modified: new Date('2020-07-06'),
        size: 0,
        children: [],
      },
      {
        type: TYPES.FILE,
        name: 'Description.rtf',
        modified: new Date('2020-07-06'),
        size: 1024,
      },
      {
        type: TYPES.FILE,
        name: 'Description.txt',
        modified: new Date('2020-07-06'),
        size: 2048,
      },
    ],
  },
];