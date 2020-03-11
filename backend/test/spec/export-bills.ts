// tslint:disable:no-unused-expression
// tslint:disable:no-console

import 'mocha';
import TransactionHelper from '../../src/services/sicoob/transaction.helper';
import FileHelper from '../utils/file.utils';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const assert = chai.assert;
chai.use(chaiHttp);

const fs = require('fs');
const  Diff = require('text-diff');
const sampleExportPaid = require('../sample/export/sample-paid.json');
const sampleExportRet = module.exports = fs.readFileSync('./test/sample/export/CED_00000137_00000028_DT_202002040751_2020-02-03.RET', 'utf8');
let exportedBills, testReturnBills;

before('Execução da exportar (RET)', async () => {
    exportedBills = (await TransactionHelper.exportBills(sampleExportPaid)).split(/\r?\n/);
    testReturnBills = sampleExportRet.split(/\r?\n/);
});

describe('Teste do arquivo exportado', () => {
    it('Deveria exportar todos os boletos', async () => {
        expect(exportedBills).to.not.be.null;
        expect(testReturnBills).to.not.be.null;
        expect(exportedBills).to.not.be.empty;
        expect(testReturnBills).to.not.be.empty;
        let index = 0;
        let allEquals = true;
        for(const exportedBill of exportedBills) {
            index++;
            if(index === 1) {
                const firstLine = exportedBills[0];
                const testFirstLine = testReturnBills[0];
                if(firstLine && testFirstLine && firstLine != testFirstLine && firstLine != null) {
                    var diff = new Diff();
                    await FileHelper.print(
                        'first_line.html',
                        diff.prettyHtml(diff.main(firstLine, testFirstLine)));
                }
                describe('Testando cabeçalho', () => {
                    it(`A primeira linha deve ser igual a ${firstLine}`, () => {
                        expect(firstLine).to.be.equals(testFirstLine);
                    });
                });
            } else if(index == (exportedBills.length - 1)) {
                describe('Testando rodapé', async () => {
                    const penultimateLine = exportedBills[exportedBills.length-2];;
                    const testPenultimateLine = testReturnBills[testReturnBills.length-2];
                    if(penultimateLine && testPenultimateLine && penultimateLine != testPenultimateLine) {
                        var diff = new Diff();
                        await FileHelper.print(
                            'penultimateLine_line.html',
                            diff.prettyHtml(diff.main(penultimateLine, testPenultimateLine)));
                    }
                    it(`A penútima linha deve ser igual a ${penultimateLine}`, () => {
                        expect(penultimateLine).to.be.equals(testPenultimateLine);
                    });

                    const lastLine = exportedBills[exportedBills.length-1];;
                    const testLastLine = testReturnBills[testReturnBills.length-1];;
                    if(lastLine && testLastLine && lastLine != testLastLine) {
                        var diff = new Diff();
                        await FileHelper.print(
                            'last_line.html',
                            diff.prettyHtml(diff.main(lastLine, testLastLine)));
                    }
                    it(`A útima linha deve ser igual a ${lastLine}`, () => {
                        expect(lastLine).to.be.equals(testLastLine);
                    });
                });
            } else {
                describe(`Testando linha: ${index}`, async () => {
                    const bill = exportedBills[index-1];
                    const testBill = testReturnBills[index-1];
                    if(bill && testBill && bill != testBill) {
                        if(index === 2) {
                            console.log('Tst:');
                            console.log(bill);
                            console.log('\n');
                            console.log('Exp:');
                            console.log(testBill);
                        }
                        var diff = new Diff();
                        await FileHelper.print(
                            `bill_line_${index}.html`,
                            diff.prettyHtml(diff.main(bill, testBill)));
                        allEquals = false;
                    }
                });
            }
        }
        expect(allEquals).to.be.equals(true);
    });
});
