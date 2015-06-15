import {computedFrom} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';


export class Welcome{
  static inject = [HttpClient];
  heading = 'Welcome to the Aurelia Navigation App! This is a test!';
  firstName = 'John';
  lastName = 'Doe';
  files = '';
  ownerUserName = '';
  repoName = '';
  dir = '';
  
  previousValue = this.fullName;
  
  constructor(http) {
    this.http = http;
  }
  
  getFileStructure(data) {
    let files = [];
    for (let d of data) {
      if (d.type == 'file') {
        files.push({
          name: d.name,
          url: d.download_url
        });
      }
      else if (d.type == 'dir')
        files.push(this.getAllFilesInRepo(this.ownerUserName, this.repoName, this.dir + '/' + d.name))
    }
    
    return files;
  }
   
  getAllFilesInRepo(ownerUserName, repoName, dir) {
    this.ownerUserName = ownerUserName;
    this.repoName = repoName;
    this.dir = dir;

    let url = `https://api.github.com/repos/${ownerUserName}/${repoName}/contents/${dir}`;
    this.http.get(url).then(res => this.files = this.getFileStructure(JSON.parse(res.response)), () => `Unable to open repository!`).catch(ex => console.log('Unable to open repo: ' + ex));
  }

  //Getters can't be observed with Object.observe, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below.
  //@computedFrom('firstName', 'lastName')
  get fullName(){
    return `${this.firstName} ${this.lastName}`;
  }
  
  submit(){
    this.previousValue = this.fullName;
    alert(`Welcome, ${this.fullName}!`);
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value){
    return value && value.toUpperCase();
  }
}
