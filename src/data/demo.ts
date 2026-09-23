import type { AppData } from '../types';

export const demoData: AppData = {
  source: 'demo',
  players: [
    { id: 'P001', name: 'Иванов Иван', position: 'Ala', status: 'Активен', age: 18, group: 'Футзал', rating: 78, physical: 74, technique: 82, tactics: 80, attendance: 92 },
    { id: 'P002', name: 'Петров Максим', position: 'Cierre', status: 'Активен', age: 18, group: 'Футзал', rating: 75, physical: 71, technique: 76, tactics: 83, attendance: 88 },
    { id: 'P003', name: 'Сидоров Артём', position: 'Pivot', status: 'Активен', age: 17, group: 'Футзал', rating: 72, physical: 80, technique: 72, tactics: 66, attendance: 95 },
    { id: 'P004', name: 'Козлов Егор', position: 'GK', status: 'Активен', age: 19, group: 'Футзал', rating: 69, physical: 67, technique: 70, tactics: 71, attendance: 90 }
  ],
  physicalProfiles: [
    { playerId: 'P001', speed: 82, cod: 68, rsa: 74, endurance: 66, power: 79, rating: 74, completeness: '5/5', limiting: 'Выносливость', strongest: 'Скорость', status: 'Полный профиль', codAsymmetry: 4.2 },
    { playerId: 'P002', speed: 70, cod: 79, rsa: 68, endurance: 71, power: 67, rating: 71, completeness: '5/5', limiting: 'Взрывная сила', strongest: 'COD', status: 'Полный профиль', codAsymmetry: 2.1 },
    { playerId: 'P003', speed: 86, cod: 75, rsa: 83, endurance: 77, power: 81, rating: 80, completeness: '5/5', limiting: 'COD', strongest: 'Скорость', status: 'Полный профиль', codAsymmetry: 5.8 }
  ]
};
