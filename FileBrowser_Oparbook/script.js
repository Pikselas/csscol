class CustomInteracter
{
    async getItems()
    {
        return [
            {"Name" : "File-1" , "IsDir" : false},
            {"Name" : "File-2" , "IsDir" : true},
            {"Name" : "Folder-1" , "IsDir" : true},
            {"Name" : "File-3" , "IsDir" : false},
        ]
    }
    gotoSubDir(name)
    {
        console.log(name);
    }
    gotoParentDir()
    {

    }
    get CurrentDirPath()
    {
        return "Home";
    }
    get CurrentDirName()
    {
        return "Home"
    }

}

document.body.appendChild(new FileBrowserWindow("","file",(v)=>{},"single",new CustomInteracter()).Window)