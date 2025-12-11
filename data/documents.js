// Description: Mock data for documents
import { TYPES } from './constants.js';

export const documents = [
  {
    type: TYPES.FOLDER,
    name: 'Legal',
    modified: new Date('2020-07-06'),
    size: 0,
    children: [
      {
        type: TYPES.FILE,
        name: 'Legal1.docx',
        modified: new Date('2020-07-06'),
        size: 3072,
      },
      {
        type: TYPES.FOLDER,
        name: 'Lawyers',
        modified: new Date('2020-07-06'),
        size: 0,
        children: [
          {
            type: TYPES.FILE,
            name: 'Lawyer1.pdf',
            modified: new Date('2020-07-06'),
            size: 4563,
          },
          {
            type: TYPES.FILE,
            name: 'Lawyer2.docx',
            modified: new Date('2020-07-06'),
            size: 4523,
          },
          {
                type: TYPES.FOLDER,
                name: 'Lawyers2',
                modified: new Date('2020-07-06'),
                size: 0,
                children: [          
                    {
                        type: TYPES.FILE,
                        name: 'Lawyer2.docx',
                        modified: new Date('2020-07-06'),
                        size: 4523,
                    },
                    {
                        type: TYPES.FOLDER,
                        name: 'Lawyers3',
                        modified: new Date('2020-07-06'),
                        size: 0,
                        children: [          
                            {
                                type: TYPES.FILE,
                                name: 'Lawyer1.docx',
                                modified: new Date('2020-07-06'),
                                size: 4523,
                            },
                            {
                                type: TYPES.FOLDER,
                                name: 'Lawyers4',
                                modified: new Date('2020-07-06'),
                                size: 0,
                                children: [          
                                    {
                                        type: TYPES.FILE,
                                        name: 'Lawyer1.docx',
                                        modified: new Date('2020-07-06'),
                                        size: 4523,
                                    },
                                ]
                            },
                        ],
                    },
                ]
            },

        ],
      },
    ],
  },
  {
    type: TYPES.FOLDER,
    name: 'Environment',
    modified: new Date('2020-07-06'),
    size: 0,
    children: [
      {
        type: TYPES.FILE,
        name: 'Env1.docx',
        modified: new Date('2020-07-06'),
        size: 1024,
      },
      {
        type: TYPES.FILE,
        name: 'Env2.docx',
        modified: new Date('2020-07-06'),
        size: 4096,
      },
    ],
  },
  {
    type: TYPES.FILE,
    name: 'Env3.pdf',
    modified: new Date('2020-07-06'),
    size: 1213,
  },
  {
    type: TYPES.FILE,
    name: 'Env4.txt',
    modified: new Date('2020-07-06'),
    size: 2356,
  },
];