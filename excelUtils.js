import * as XLSX from "xlsx"

// Function to process and update the Excel file
export const updateExcelFile = (file, scannedData, onComplete) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    const binaryStr = e.target.result
    const workbook = XLSX.read(binaryStr, { type: "binary" })

    // Get the first sheet
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Convert sheet to JSON
    const data = XLSX.utils.sheet_to_json(sheet)

    // Match scanned data and update the "Scanned" column
    data.forEach((row) => {
      if (
        row["Customer Name"] === scannedData["Customer Name"] &&
        String(row["No of Tickets"]) === String(scannedData["No of Tickets"]) &&
        String(row["Total Paid Amount"]) ===
          String(scannedData["Total Paid Amount"])
      ) {
        row["Scanned"] = "YES"
      }
    })

    // Convert updated JSON back to sheet
    const updatedSheet = XLSX.utils.json_to_sheet(data)

    // Update the workbook
    workbook.Sheets[sheetName] = updatedSheet

    // Create a new Excel file and download it
    const updatedFile = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "binary",
    })
    const blob = new Blob([s2ab(updatedFile)], {
      type: "application/octet-stream",
    })

    // Trigger file download
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "Updated_File.xlsx"
    link.click()

    onComplete && onComplete()
  }

  reader.readAsBinaryString(file)
}

// Helper to convert string to ArrayBuffer
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}
