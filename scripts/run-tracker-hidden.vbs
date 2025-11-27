Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the script directory
scriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
projectRoot = objFSO.GetParentFolderName(scriptPath)
trackerScript = projectRoot & "\scripts\tracker.js"

' Find Node.js
Set objEnv = objShell.Environment("PROCESS")
nodePath = objShell.ExpandEnvironmentStrings("%ProgramFiles%\nodejs\node.exe")
If Not objFSO.FileExists(nodePath) Then
    nodePath = objShell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\nodejs\node.exe")
End If
If Not objFSO.FileExists(nodePath) Then
    ' Try to find node in PATH
    On Error Resume Next
    nodePath = objShell.ExpandEnvironmentStrings("node.exe")
    On Error Goto 0
End If

If Not objFSO.FileExists(nodePath) Then
    WScript.Quit 1
End If

' Change to project directory and run tracker
objShell.CurrentDirectory = projectRoot
objShell.Run """" & nodePath & """ """ & trackerScript & """", 0, False

