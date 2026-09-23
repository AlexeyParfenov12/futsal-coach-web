const SPREADSHEET_ID = '1csgLOz1ihumjqb_RfFGtrM2R1pZPbm7cYIMoSR5nvXc';

const SHEETS = {
  players: 'Игроки',
  rating: 'Рейтинг',
  physical: 'Физические тесты',
  physicalProfile: 'Физический профиль'
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Futsal Coach')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getValues_(sheetName) {
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) throw new Error('Лист не найден: ' + sheetName);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return [];
  return sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
}

function toNumber_(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function getAppData() {
  const playersRows = getValues_(SHEETS.players);
  const ratingRows = getValues_(SHEETS.rating);
  const profileRows = getValues_(SHEETS.physicalProfile);

  const ratingById = {};
  ratingRows.slice(1).forEach(function(r) {
    if (!r[0]) return;
    ratingById[r[0]] = {
      physical: toNumber_(r[2]),
      technique: toNumber_(r[3]),
      tactics: toNumber_(r[4]),
      rating: toNumber_(r[6]),
      attendance: toNumber_(r[7])
    };
  });

  const players = playersRows.slice(1).filter(function(r) { return r[0]; }).map(function(r) {
    return Object.assign({
      id: r[0],
      name: r[1],
      position: r[6],
      secondaryPosition: r[7],
      status: r[11],
      age: toNumber_(r[4]),
      group: r[5],
      profile: r[14]
    }, ratingById[r[0]] || {});
  });

  const physicalProfiles = profileRows.slice(1).filter(function(r) { return r[0]; }).map(function(r) {
    return {
      playerId: r[0],
      speed: toNumber_(r[2]),
      cod: toNumber_(r[3]),
      rsa: toNumber_(r[4]),
      endurance: toNumber_(r[5]),
      power: toNumber_(r[6]),
      rating: toNumber_(r[7]),
      codAsymmetry: toNumber_(r[8]),
      completeness: r[9],
      limiting: r[10],
      strongest: r[11],
      batteryId: r[12],
      date: r[13],
      status: r[14]
    };
  });

  return {
    players: players,
    physicalProfiles: physicalProfiles,
    source: 'google-sheets'
  };
}

function savePlayer(payload) {
  if (!payload || !payload.name || !payload.sex || !payload.birthDate || !payload.position) {
    throw new Error('Заполни ФИО, пол, дату рождения и основную позицию');
  }

  const allowedSex = ['м', 'ж'];
  const allowedPositions = ['GK', 'Cierre', 'Ala', 'Pivot', 'Универсал'];

  if (allowedSex.indexOf(payload.sex) === -1) {
    throw new Error('Некорректный пол');
  }
  if (allowedPositions.indexOf(payload.position) === -1) {
    throw new Error('Некорректная основная позиция');
  }
  if (payload.secondaryPosition && allowedPositions.indexOf(payload.secondaryPosition) === -1) {
    throw new Error('Некорректная дополнительная позиция');
  }

  const sheet = getSpreadsheet_().getSheetByName(SHEETS.players);
  if (!sheet) throw new Error('Лист "Игроки" не найден');

  const row = Math.max(2, findFirstEmptyRow_(sheet, 1));
  const playerId = nextPlayerId_(sheet);
  const birthDate = new Date(payload.birthDate + 'T12:00:00');
  if (isNaN(birthDate.getTime())) throw new Error('Некорректная дата рождения');

  const values = [[
    playerId,
    String(payload.name).trim(),
    payload.sex,
    birthDate,
    '',
    payload.group || '',
    payload.position,
    payload.secondaryPosition || '',
    '',
    payload.position === 'GK' ? 'Да' : 'Нет',
    payload.email || '',
    'Активен',
    new Date(),
    payload.comment || '',
    '',
    'Нет'
  ]];

  sheet.getRange(row, 1, 1, 16).setValues(values);
  sheet.getRange(row, 5).setFormula('=IF(D' + row + '="","",DATEDIF(D' + row + ',TODAY(),"Y"))');
  sheet.getRange(row, 4).setNumberFormat('dd.mm.yyyy');
  sheet.getRange(row, 13).setNumberFormat('dd.mm.yyyy');

  SpreadsheetApp.flush();

  return {
    ok: true,
    row: row,
    playerId: playerId,
    appData: getAppData()
  };
}

function nextPlayerId_(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 2);
  const values = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  let maxNumber = 0;

  values.forEach(function(row) {
    const match = String(row[0] || '').match(/^P(\d+)$/i);
    if (match) maxNumber = Math.max(maxNumber, Number(match[1]));
  });

  return 'P' + String(maxNumber + 1).padStart(3, '0');
}

function savePhysicalTest(payload) {
  if (!payload || !payload.playerId || !payload.code) {
    throw new Error('Не хватает PlayerID или кода теста');
  }

  const allowed = ['F1','F2','F3-R','F3-L','F4','F5','F6'];
  if (allowed.indexOf(payload.code) === -1) {
    throw new Error('Неизвестный тест: ' + payload.code);
  }

  const sheet = getSpreadsheet_().getSheetByName(SHEETS.physical);
  if (!sheet) throw new Error('Лист "Физические тесты" не найден');

  const attempts = (payload.attempts || []).map(Number);
  if (!attempts.length || attempts.some(function(v) { return !Number.isFinite(v) || v <= 0; })) {
    throw new Error('Проверь введённые результаты');
  }

  const expected = payload.code === 'F4' ? 6 : payload.code === 'F5' ? 1 : 3;
  if (attempts.length !== expected) {
    throw new Error('Для ' + payload.code + ' нужно попыток: ' + expected);
  }

  const row = Math.max(2, findFirstEmptyRow_(sheet, 2));
  const batteryId = payload.batteryId || makeBatteryId_();

  sheet.getRange(row, 1).setValue(new Date());
  sheet.getRange(row, 2).setValue(payload.playerId);
  sheet.getRange(row, 3).setValue(payload.code);
  sheet.getRange(row, 8).setValue('Действующий');
  sheet.getRange(row, 9).setValue(payload.testType || 'Контрольное');
  sheet.getRange(row, 10).setValue(batteryId);
  sheet.getRange(row, 11, 1, attempts.length).setValues([attempts]);

  if (payload.code === 'F5' && payload.fietDistance) {
    sheet.getRange(row, 19).setValue(Number(payload.fietDistance));
  }

  sheet.getRange(row, 21).setValue(payload.method || 'Другое');

  if (payload.comment) {
    sheet.getRange(row, 25).setValue(payload.comment);
  }

  if (payload.code === 'F4' && payload.rsa5m && payload.rsa5m.length) {
    const splits = payload.rsa5m.map(function(v) {
      return v === '' ? '' : Number(v);
    });
    const padded = splits.slice(0, 6);
    while (padded.length < 6) padded.push('');
    sheet.getRange(row, 31, 1, 6).setValues([padded]);
  }

  SpreadsheetApp.flush();

  return {
    ok: true,
    row: row,
    batteryId: batteryId,
    appData: getAppData()
  };
}

function findFirstEmptyRow_(sheet, keyColumn) {
  const max = Math.max(sheet.getLastRow(), 2);
  const values = sheet.getRange(2, keyColumn, max - 1, 1).getDisplayValues();
  const idx = values.findIndex(function(r) { return !r[0]; });
  return idx === -1 ? max + 1 : idx + 2;
}

function makeBatteryId_() {
  const tz = Session.getScriptTimeZone() || 'Europe/Riga';
  const stamp = Utilities.formatDate(new Date(), tz, 'yyyyMMdd');
  return 'PHY-' + stamp;
}
