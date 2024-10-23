export interface Destination {
  name: string;
  lat: number;
  lng: number;
  elevation: number;
  description?: string;
  timeFromPrevious?: string;
  subDestinations?: Destination[];
  isHotel?: boolean;
}

export const trekData: Destination[] = [
  {
    name: 'Syabrubesi',
    lat: 28.1617,
    lng: 85.3467,
    elevation: 1503,
    description: 'Starting point of the trek',
    isHotel: true
  },
  {
    name: 'Domen',
    lat: 28.15157911891836, 
    lng: 85.3708619588358,
    elevation: 2150,
    timeFromPrevious: '3hr',
    isHotel: true
  },
  {
    name: 'Pairo',
    lat:  28.152850543584634,
    lng:  85.37852408734497,
    elevation: 2350,
    timeFromPrevious: '1hr 30min',
      isHotel: true
  },
  {
    name: 'Bamboo',
    lat: 28.156408841342945, 
    lng: 85.39777490770541,
    elevation: 2400,
    timeFromPrevious: '45min',
    isHotel: true
  },
   {
    name: 'Rimche',
    lat: 28.15951141876224,
    lng:  85.42137834738355,
    elevation: 2400,
    timeFromPrevious: '45min',
    isHotel: true
  },
  {
    name: 'Lama Hotel',
    lat: 28.164835781373448,
    lng:  85.42263555459915,
    elevation: 2480,
    timeFromPrevious: '20 min',
    isHotel: true
  },
    {
    name: 'Riverside Hotel',
    lat: 28.18329820876107, 
    lng: 85.44200384168327,
    elevation: 2480,
    timeFromPrevious: '1hr 15min',
    isHotel: true
  },
  {
    name: 'Ghodatabela',
    lat: 28.200849301431013,
    lng:  85.4606523187279,
    elevation: 3000,
    timeFromPrevious: '2hr 30min',
    isHotel: true
  },
  {
    name: 'Thangsyap',
    lat: 28.205442,
    lng: 85.471037,
    elevation: 3150,
    timeFromPrevious: '1hr 30min',
    isHotel: true
  },
  {
    name: 'Langtang Village',
    lat:  28.215503344106224, 
    lng: 85.50996942730843,
    elevation: 3430,
    description: 'Rebuilt after the 2015 earthquake',
    timeFromPrevious: '1hr 30min',
    isHotel: true
  },
  {
    name: 'Mundu',
    lat: 28.2150,
    lng: 85.5400,
    elevation: 3540,
    timeFromPrevious: '45min',
    isHotel: true
  },
  {
    name: 'Kyanjin Gompa',
    lat: 28.2117,
    lng: 85.5683,
    elevation: 3850,
    description: 'Beautiful monastery and viewpoint',
    timeFromPrevious: '1hr 30min',
    isHotel: true,
    subDestinations: [
      {
        name: 'Tserko Ri',
        lat: 28.213934676386334, 
        lng:  85.60184608795807,
        elevation: 4990,
        description: 'Highest point of the trek with panoramic views',
        timeFromPrevious: '3hr'
      },
      {
        name: 'Kyanjin Ri',
        lat:  28.217888263202244, 
        lng: 85.5705869729156,
        elevation: 4400,
        description: 'Excellent viewpoint for sunrise',
        timeFromPrevious: '2hr 30min'
      },
      {
        name: 'Kyanjin Ri Peak',
        lat: 28.22388386996899, 
        lng: 85.57602169081248,
        elevation: 5570,
        description: 'Closest safe viewpoint of Langtang Lirung',
        timeFromPrevious: '4hr'
      }
    ]
  }
];