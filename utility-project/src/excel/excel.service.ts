import { HttpException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import  * as XLSX from 'xlsx'

@Injectable()
export class ExcelService {
    updateExcelFile(data): void {
        try{
            const file = XLSX.readFile('./src/excel/excelData/excel-logs.xls')
            const sheetName = file.SheetNames[0]
            
            const sheet = file.Sheets[sheetName]
 
            const stillData = XLSX.utils.sheet_to_json(sheet)

            const updated = [...data, ...stillData]
            const sheetData = XLSX.utils.json_to_sheet(updated)

            const workBook = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(workBook, sheetData, sheetName)

            XLSX.writeFile(workBook, './src/excel/excelData/excel-logs.xls')
        }catch(e) {
            throw new RpcException(e.message)
        }
    }
}