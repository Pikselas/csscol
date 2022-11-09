/*
     Interacts with the server on the path
     given to constructor
*/

class FileBrowserBackendInteracter
{
    #ServerPath;
    #CurrentPath;
    constructor(path)
    {
        this.#ServerPath = path;
        this.#CurrentPath = "";
    }
    async getItems()
    {
        let res = await fetch(this.#ServerPath + '/' +  this.#CurrentPath);
        return await res.json();
    }
    gotoSubDir(subdir)
    {
        this.#CurrentPath == "" ? this.#CurrentPath = subdir : this.#CurrentPath += "/" + subdir;
    }
    gotoParentDir()
    {
        this.#CurrentPath = this.#CurrentPath.substring(0 , this.#CurrentPath.lastIndexOf('/'));
    }
    get CurrentDirPath()
    {
        return this.#CurrentPath;
    }
    get CurrentDirName()
    {
        return this.#CurrentPath.split('/').at(-1);
    }
}
/*
  Creates a filebrowsing window
  accept = "file" | "dir"
  acceptfunc = (a function that takes a single paramter (param will be treated as array or single based on acceptype))
  accepttype = "single" | "multiple"
*/
class FileBrowserWindow
{
    #FileBrowser;
    #Window;
    #ItemsPanel;
    #SelectMode;
    constructor(path , accept = "file" , acceptfunc = (item) => {} , accepttype = "single" , backend_interacter = new FileBrowserBackendInteracter(path))
    {
        this.#FileBrowser = backend_interacter;
        this.#Window = document.createElement("div");
        this.#Window.className = "FileBrowserWindow";
        this.#SelectMode = {"type" : accept , "func" : acceptfunc , "count" : accepttype};
        
        let RotatingSection = document.createElement("div");
        RotatingSection.className = "Rotor";
        RotatingSection.appendChild(document.createElement("div"));
        RotatingSection.appendChild(document.createElement("div"));
        this.#Window.appendChild(RotatingSection);

        let MainPanel = document.createElement("div");
        MainPanel.className = "MainPanel";
        let ToolsSection = document.createElement("div");
        ToolsSection.className = "Tools";
        let UpDirButton = document.createElement("img");
        UpDirButton.src = "icons/up-arrow.png";
        UpDirButton.onclick = ()=>{ this.#FileBrowser.gotoParentDir(); this.fetchItems(); };
        ToolsSection.appendChild(UpDirButton);
        if(accept == "dir" || accepttype == "multiple")
        {
            let SelectButton = document.createElement("img");
            SelectButton.src = "icons/check-mark-small.png";

            if(accept == "dir" && accepttype == "multiple")
            {
                let addButton = document.createElement("img");
                addButton.src = "icons/plus-small.png";
                addButton.onclick = () => { this.SelectedItems[this.#FileBrowser.CurrentDirPath] = this.#FileBrowser.CurrentDirName };
                ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
                ToolsSection.appendChild(addButton);
            }
            
            if(accepttype == "single")
            {
              SelectButton.onclick = () => { acceptfunc(this.#FileBrowser.CurrentDirPath); };
            }
            else if(accepttype == "multiple")
            {
                this.SelectedItems = {};
                SelectButton.onclick = () => { acceptfunc(Object.keys(this.SelectedItems)); };
                let SelectedContainer = document.createElement("img");
                SelectedContainer.src ="icons/collection-small.png";

                let SelectedPanel = null;

                SelectedContainer.onclick = () => {
                    if(SelectedPanel != null)
                    {
                       SelectedPanel.parentElement.removeChild(SelectedPanel);
                       SelectedPanel = null;
                    }
                    else
                    {
                        SelectedPanel = document.createElement("div");
                        SelectedPanel.className = "SelectedPanel";
                        Object.keys(this.SelectedItems).forEach((itm)=>{
                            let dv = document.createElement("div");
                            dv.className = "Item";
                            dv.innerHTML = "&nbsp;&nbsp;" + this.SelectedItems[itm];
                            SelectedPanel.appendChild(dv);
                            let CloseIco = document.createElement("img");
                            CloseIco.src = "icons/remove.png";
                            dv.appendChild(CloseIco);
                            dv.onclick = () => {
                                delete this.SelectedItems[itm];
                                setTimeout(()=>{SelectedPanel.removeChild(dv)},10);
                            }
                        });
                        this.#Window.appendChild(SelectedPanel);
                    }
                };

                ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
                ToolsSection.appendChild(SelectedContainer);
            }

            ToolsSection.appendChild(document.createTextNode("\u00A0\u00A0"));
            ToolsSection.appendChild(SelectButton);
        }
        MainPanel.appendChild(ToolsSection);
        this.#Window.appendChild(MainPanel);

        this.#ItemsPanel = document.createElement("div");
        this.#ItemsPanel.className = "ItemSection";
        MainPanel.appendChild(this.#ItemsPanel);

        this.fetchItems();

    }
    #makeFilePanel(name)
    {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item File";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        if(this.#SelectMode["type"] == "file")
        {
            panel.onclick = () =>{  this.#SelectMode["count"] == "single"
                                            ? 
                                    this.#SelectMode["func"](this.#FileBrowser.CurrentDirPath + '/' + name)
                                            :
                                    this.SelectedItems[this.#FileBrowser.CurrentDirPath + '/' + name] = name
                                 };
        }
        return panel
    }
    #makeFolderPanel(name)
    {
        let panel = document.createElement("div");
        panel.title = name;
        panel.className = "Item Folder";
        panel.appendChild(document.createElement("div"));
        panel.children[0].innerHTML = name;
        panel.onclick = ()=>{
            this.#FileBrowser.gotoSubDir(name);
            this.fetchItems();
        }
        return panel;
    }
    fetchItems()
    {
        this.#FileBrowser.getItems().then((items)=>{
            this.#ItemsPanel.innerHTML = '';
            let TimeInterVal = 20;
            items.forEach((arr)=>{
                let panel = arr["IsDir"] ? this.#makeFolderPanel(arr["Name"]) : this.#makeFilePanel(arr["Name"]);
                panel.style.opacity = 0;
                panel.style.transform = "scale(0)";
                this.#ItemsPanel.appendChild(panel);
                setTimeout(()=>{panel.style.opacity = 1 ; panel.style.transform = "scale(1)";} , TimeInterVal);
                TimeInterVal += 20;
            });
        });
    }
    get Window()
    {
        return this.#Window;
    }
}