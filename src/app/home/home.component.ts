import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Api2Service } from '../service/api2.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  remove(){
    this.activeMatches = []
    this.activeSportName = ''
  }
  filterTeams: any[]=[];
  filteredGames: any[]=[];
  searchQuery: string = '';
  onSearch() {
    if(this.searchQuery === ''){
      this.filteredGames = []
      return;
    }
    this.filterTeams = this.teamsData.filter(team=>team.Name.toLowerCase().includes(this.searchQuery))
    if(this.filterTeams.length == 0){
      this.filteredGames = []
      return
    }
    let team = this.filterTeams[0]
    let regions = this.sportData.find(item => item.ID == team.Sport).Regions
    let allChamps = Object.values(regions).flatMap(
      (region : any) => Object.values(region.Champs).map(
        (champ : any) => champ.GameSmallItems
      )
    )
    let unionGames = allChamps.flatMap((item: any) => Object.values(item))
    this.filteredGames = unionGames.filter((champ : any) => champ.t1 == team.ID || champ.t2 == team.ID)
  }
  isDropdownOpen = false;
  selectedOption: string = '';
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  activeRegions : any[] = []
  activeChamps : any[] = []
  activeSportName = ''
  activeMatches : any = []
  activeChampsIndex = 0
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  formatDate(datetime: string){
    var d = new Date(datetime);
    var day = this.days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes().toString();
    if (parseInt(min) < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }
    var date = d.getDate();
    var month = this.months[d.getMonth()];
    var year = d.getFullYear();

    return date + " " + month + " " + hr + ":" + min + ampm;
  }
  getTeamById(id : number){
    return this.teamsData.find(t=>t.ID==id)
  }
  toggleRegion(region: any , index: number){
    let isChecked = !region.checked;
    region.checked = isChecked;
    region.indeterminate = false ; 
    this.activeChamps.forEach(champ => champ.checked = isChecked)
  }
  toggleChamp(region: any , champ : any, name: string, id: number){
    champ.checked = !champ.checked;
    let totalChamps = this.activeChamps.length;
    let checkedChamps = this.activeChamps.filter(champ => champ.checked).length;
    if(checkedChamps === totalChamps){
      region.checked = true;
      region.indeterminate = false;
    } else if(checkedChamps > 0){
      region.checked = false;
      region.indeterminate = true;
    } else{
      region.checked = false ;
      region.indeterminate = false;
    }
    if(!champ.checked){
      this.removeMatches(champ, id)
    }else{
      this.setMatches(champ, name, id)
    }
  }
  selectDropdown : number | null = null;
  selectedSports : any[] = [];
  selectSport(data : any , index : number){
    let selectedSport = {
      sportName: data.keyName,
      regions: Object.values(data.Regions),
      champs : Object.values(data.Champs),
      matches : []
    };
    this.selectedSports.unshift(selectedSport);
    console.log(this.selectedSports)
  }
  setMatch(data: any, sportIndex: number){
    this.selectedSports[sportIndex].matches = [...Object.values(data.GameSmallItems)];
  }
  setData(data:any, index : number) {
    if(this.selectDropdown === index){
      this.selectDropdown = null;
    }else{
      this.selectDropdown = index
    }
    this.activeRegions = Object.values(data.Regions)
    this.activeSportName = data.KeyName;
    this.activeChamps = [];
    this.activeChampsIndex = 0;
  }
  setChamps(data:any,i : number) {
    this.activeChamps = Object.values(data.Champs)
    this.activeChampsIndex = i
    this.isDropdownOpen = true
  }
  setMatches(matches:any, name: string, id: number){
    var sport = this.activeMatches.find((el:any) => el.id == id)
    if (!sport) {
      this.activeMatches.unshift({
        id,
        name,
        matches: [...Object.values(matches.GameSmallItems)]
      })
      return;
    }

    sport.matches = Object.values(matches.GameSmallItems).concat(sport.matches)
  }

  removeMatches(champ: any, id: number) {
    var sport = this.activeMatches.find((el:any) => el.id == id)
  
    Object.values(champ.GameSmallItems).forEach((game:any) => {
      sport.matches.splice(sport.matches.indexOf(game), 1)
    })
    if(sport.matches.length == 0){
     this.activeMatches = this.activeMatches.filter((el:any) => el.id !=sport.id)
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
  constructor(private api1 : ApiService,private api2 : Api2Service,){

    this.api1.getData().subscribe((data: any) =>{
      if (typeof data === "string") {
        let parsedData = JSON.parse(data); 
        this.array = parsedData.EN.Sports;
        this.sportData = Object.keys(this.array).map((key)=>this.array[key])
        // console.log(this.sportData)
      } else {
        // console.log("Data is already an object:", data);
      }});


    this.api2.getData2().subscribe((data:any)=>{
      if (typeof data === "string") {
        let parsedData1 = JSON.parse(data);
        this.array2 = parsedData1;
        this.teamsData = Object.keys(this.array2).map((key)=>this.array2[key])
        // console.log(this.teamsData)
      } else {
        // console.log("Data is already an object:", data);
      }});
  
  }
   
  public data: any;

  public teamsData : any [] = []
  public sportData : any [] = []
  public sportList!: any;
  public teamsList!:any;
  public array : { [key: string] : any}={}
  public array2 : { [key: string] : any}={}
}
