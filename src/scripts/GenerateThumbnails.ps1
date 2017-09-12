#Path to your Ghostscript EXE
$tool = 'C:\\Program Files\\gs\\gs9.21\\bin\\gswin64.exe'

#Directory containing the PDF files that will be converted
$inputDir = 'D:\\Puzzling\\FinalPDFs\\'

#Output path where the thumbnail png files will be saved
$pdfOutputDir = 'D:\\Puzzling\\FinalPDFs\\Puzzles\\'

#Output path where the thumbnail png files will be saved
$pngOutputDir = 'D:\Puzzling\FinalPDFs\Puzzles\Thumbnails\'

$pdfs = get-childitem $inputDir | where {$_.Extension -match "pdf"}

foreach($pdf in $pdfs)
{
    #"The pdf name to start: " + $pdf.BaseName
    #strip names of spaces and punctuation
    $simplePdf = $pdf.BaseName.replace(' ','').replace('-', '').replace("'","").replace(",","").replace("?","").replace(".","")
    #"The name of the pdf: " + $simplePdf

    #Next add a random string to secure the path
    $rand = -join ((65..90) + (97..122) | Get-Random -Count 6 | % {[char]$_})
    #"Random: " + $rand

    #Add the random string to the base name
    "The secure name: " + $simplePdf + $rand

    $png = $pngOutputDir + $simplePdf + $rand + ".png"
    #if(test-path $png)

    $numMatches = 0
    $numMatches = (Get-ChildItem $pngOutputDir -Filter ($simplePdf + '*')).Length
    if($numMatches -gt 0)
    {
        "Thumbnail png file already exists " + $png
    }
    else        
    {   
        #Copy the file with secure name to the output folder
        cp $pdf.FullName ($pdfOutputDir + $simplePdf + $rand + ".pdf")
        
        'Processing ' + $pdf.Name        
        $param = "-sOutputFile=$png"
        & $tool -q  -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r100 -dGraphicsAlphaBits=4 $param $pdf.FullName 
    }
}
