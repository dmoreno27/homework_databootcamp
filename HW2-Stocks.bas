Attribute VB_Name = "Module2"
Sub stock_moderate()

Dim ws As Worksheet
Dim Ticker As String
Dim TotalStock As Double
Dim Yearly_Change As Double
Dim Daily_Change As Double
Dim Percent_Change As Double
Dim SumColumn As Integer
Dim Year_Start As Double

For Each ws In Worksheets
ws.Activate

TotalStock = 0
SumColumn = 2
Year_Start = Cells(2, 3).Value
Yearly_Change = 0
Percent_Change = 0

ws.Range("I1").Value = "Ticker"
ws.Range("J1").Value = "Yearly Change"
ws.Range("K1").Value = "Percent Change"
ws.Range("L1").Value = "Total Stock Volume"

lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row
ws.Range("K2:K" & lastrow).NumberFormat = "0.00%"


    For i = 2 To lastrow
    
        If Cells(i + 1, 1).Value <> Cells(i, 1).Value Then
        
            Ticker = Cells(i, 1).Value
            
            Yearly_Change = Cells(i, 6).Value - Year_Start
            
           
            
            If Cells(i, 6).Value = 0 And Year_Start = 0 Then
            Percent_Change = 0
            ElseIf Year_Start = 0 And Cells(i, 6).Value <> 0 Then
            Percent_Change = 1
            Else
            Percent_Change = Yearly_Change / Year_Start
            End If
             TotalStock = TotalStock + Cells(i, 7).Value
            
            ws.Range("I" & SumColumn).Value = Ticker
            ws.Range("J" & SumColumn).Value = Yearly_Change
            ws.Range("K" & SumColumn).Value = Percent_Change
            ws.Range("L" & SumColumn).Value = TotalStock
            
 
       
           If Yearly_Change > 0 Then
           Cells(SumColumn, 10).Interior.ColorIndex = 4
           ElseIf Yearly_Change < 0 Then
           Cells(SumColumn, 10).Interior.ColorIndex = 3
           Else
           Cells(SumColumn, 10).Interior.ColorIndex = xlNone
           End If
        
            
            TotalStock = 0
            Year_Start = Cells(i + 1, 3).Value
            SumColumn = SumColumn + 1
            Percent_Change = 0

           
        Else
        
             TotalStock = TotalStock + Cells(i, 7).Value
            
           
        End If
        
       
        
    Next i

Next ws
    
End Sub



