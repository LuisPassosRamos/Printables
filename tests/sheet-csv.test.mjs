import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCsvRows } from '../src/services/sheetCsv.ts';

test('lê BOM, preços brasileiros, aspas e descrições de várias linhas', () => {
  const csv = '\uFEFFID,PRODUTO,VALOR DE VENDA,DESCRIÇÃO\r\n'
    + '1,"Vaso ""Lua""","R$ 12,50","Feito em PLA\r\nCor sob consulta"\r\n'
    + '2,Suporte,20,\r\n';
  assert.deepEqual(parseCsvRows(csv), [
    { ID: '1', PRODUTO: 'Vaso "Lua"', 'VALOR DE VENDA': 'R$ 12,50', DESCRIÇÃO: 'Feito em PLA\r\nCor sob consulta' },
    { ID: '2', PRODUTO: 'Suporte', 'VALOR DE VENDA': '20', DESCRIÇÃO: '' },
  ]);
});

test('preserva células opcionais vazias e aceita planilhas sem produtos', () => {
  assert.deepEqual(parseCsvRows('ID,PRODUTO,TAG\n1,Vaso\n\n'), [
    { ID: '1', PRODUTO: 'Vaso', TAG: '' },
  ]);
  assert.deepEqual(parseCsvRows('ID,PRODUTO\n'), []);
  assert.deepEqual(parseCsvRows(''), []);
});

test('rejeita aspas sem fechamento', () => {
  assert.throws(() => parseCsvRows('ID,PRODUTO\n1,"Vaso\n'), /CSV inválido/);
});
