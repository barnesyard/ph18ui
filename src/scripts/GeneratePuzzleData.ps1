#Path to CSV file with data
$csvFile = 'D:\\Puzzling\\AllPuzzleData.csv'

$csvData = Import-Csv $csvFile

$imports = @()
$body = @()
$body += "class PuzzleData {"
$body += "  constructor() {"
$body += "    this.puzzleData = {"

$csvData|ForEach-Object {
    $importPdfVar = $_.title.replace(' ','').replace('-', '').replace("'","").replace(",","").replace("?","").replace(".","") + "Pdf"
    $importPngVar = $_.title.replace(' ','').replace('-', '').replace("'","").replace(",","").replace("?","").replace(".","") + "Png"
    $thisPdfImport = "import " + $importPdfVar + " from './Puzzles/" + $_.file + "';"
    $thisPngImport = "import " + $importPngVar + " from './Puzzles/Thumbnails/" + $_.file.replace("pdf", "png") + "';"
    $imports += $thisPdfImport
    $imports += $thisPngImport

    $puzzleID = $_.title.replace(' ','').replace('-', '').replace("'","").replace(",","").replace("?","").replace(".","")
    $body += "      """ + $puzzleID + """: {`n        ""puzzleId"": """ + $puzzleID + ""","
        foreach ($property in $_.PSObject.Properties)
        {
            $name = """" + $property.Name + """"
            if ($name -eq """position""") {
                $value = $property.Value 
            } else {
                $value = """" + $property.Value + """"
            }
            if ($name -eq """answer""") {
                $value =  """lorem"""
            }
            $bodyLine = "        " + $name + ": " + $value + ","
            if ($name -eq """file""") {
                $bodyLine = "        ""pdf"": " + $importPdfVar + ",`n        ""png"": " + $importPngVar + ","
            }
            $body += $bodyLine
        } 
        $body += "        ""guesses"": [],"
        if ($_.position -eq 0) {
            $body += "        ""status"": ""unlocked"","
        } else {
            $body += "        ""status"": ""locked"","
        }
            $body += "},"


}

$body += "    };"
$body += "  }"
$body += ""
$body += "  getPuzzleData() {"
$body += "    return this.puzzleData;"
$body += "  }"
$body += ""
$body += "}"
$body += "export { PuzzleData };"

$imports
$body

$imports | Out-File -Encoding ascii D:/Puzzling/puzzledata.js
$body | Out-File -Encoding ascii -Append D:/Puzzling/puzzledata.js