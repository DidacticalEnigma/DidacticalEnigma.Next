Invoke-WebRequest -Uri "https://go.microsoft.com/fwlink/p/?LinkId=2124703" -OutFile webview_installer.exe
if($?)
{
	.\webview_installer.exe /silent /install
}

Invoke-WebRequest -Uri "https://download.visualstudio.microsoft.com/download/pr/343dc654-80b0-4f2d-b172-8536ba8ef63b/93cc3ab526c198e567f75169d9184d57/dotnet-sdk-6.0.101-win-x64.exe" -OutFile net6_installer.exe
if($?)
{
	.\net6_installer.exe /install /quiet /norestart
}


Invoke-WebRequest -Uri "https://aka.ms/vs/17/release/vc_redist.x64.exe" -OutFile visual_cpp_redistributable_installer.exe
if($?)
{
	.\visual_cpp_redistributable_installer.exe /install /quiet /norestart
}