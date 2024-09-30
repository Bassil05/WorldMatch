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
    this.filterTeams = this.teamsData.filter(team=>team.Name == this.searchQuery)
    if(this.filterTeams.length > 0){
      let team = this.filterTeams[0]
      console.log(team)
      let regions = this.sportData.find(item => item.ID == team.Sport).Regions
      let allChamps = Object.values(regions).flatMap(
        (region : any) => Object.values(region.Champs).map(
          (champ : any) => champ.GameSmallItems
        )
      )
      console.log(allChamps)
      let unionGames = allChamps.flatMap((item: any) => Object.values(item))
      this.filteredGames = unionGames.filter((champ : any) => champ.t1 == team.ID || champ.t2 == team.ID)
      console.log(this.filteredGames)
    }
  }
  isDropdownOpen = false;
  selectedOption: string = '';
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  activeRegions : any[] = []
  activeChamps : any[] = []
  activeSportName = ''
  activeMatches : any[] = []
  activeChampsIndex = 0
  getTeamById(id : number){
    return this.teamsData.find(t=>t.ID==id)
  }
  setData(data:any) {
    this.activeRegions = Object.values(data.Regions)
    this.activeSportName = data.KeyName;
    this.activeChamps = [];
    this.activeChampsIndex = 0;
    this.activeMatches = [];
  }
  setChamps(data:any,i : number) {
    this.activeChamps = Object.values(data.Champs)
    this.activeChampsIndex = i
    this.isDropdownOpen = true
    // console.log(this.activeChamps)
  }
  setMatches(matches:any){
    this.activeMatches = [...this.activeMatches, ...Object.values(matches.GameSmallItems)]
    // console.log(this.activeMatches)
  }
  clearMatches(){
    this.activeMatches = [];
  }
  // toggleDropdown() {
  //   this.isDropdownOpen = !this.isDropdownOpen;

  // }
  selectOption(option: string) {
    this.selectedOption = option;
  }
  constructor(private api1 : ApiService,private api2 : Api2Service,){

    this.api1.getData().subscribe((data: any) =>{
      if (typeof data === "string") {
        let parsedData = JSON.parse(data); 
        this.array = parsedData.EN.Sports;
        this.sportData = Object.keys(this.array).map((key)=>this.array[key])
        console.log(this.sportData)
      } else {
        console.log("Data is already an object:", data);
      }});


    this.api2.getData2().subscribe((data:any)=>{
      if (typeof data === "string") {
        let parsedData1 = JSON.parse(data);
        this.array2 = parsedData1;
        this.teamsData = Object.keys(this.array2).map((key)=>this.array2[key])
        console.log(this.teamsData)
      } else {
        console.log("Data is already an object:", data);
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
